import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import * as dayjs from 'dayjs';

import { WebSocketService } from 'src/app/configs/websocket.service';
import { HealthData } from 'src/app/models/appconstants/health';
import { AuthService } from 'src/app/services/auth.service';
import { HealthDataApiService } from 'src/app/services/health.service';
import { environment } from 'src/environments/environments';

import { Chart, registerables, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
Chart.register(...registerables);

import { forkJoin } from 'rxjs';
import { ConsentGateService } from 'src/app/services/consent.service';

type TabKey = 'overview' | 'trends' | 'insights';
type Status = 'danger'|'warn'|'success'|'info';

interface InsightDTO {
  username: string;
  generatedAt: string;
  overallRisk: number;
  respiratoryRisk: number;
  fatigueRisk: number;
  activityRisk: number;
  summary: string;
  trendNotes: string[];
  spo2: number|null;
  respirationsPerMinute: number|null;
  steps: number|null;
  bodyBattery: number|null;
  heartRateVariability: number|null;
  insightCards?: Array<{ title:string; subtitle?:string; status:Status; timeframe?:string; confidence?:number; icon?:string }>;
  recommendations?: Array<{ id:string; title:string; rationale:string; action:string; confidence?:number; why?:string }>;
}
interface InsightCardVM {
  title: string; subtitle?: string; status: Status; timeframe: string; confidence?: number; icon?: string;
}
interface RecommendationVM {
  id: string; title: string; rationale: string; action: string; confidence?: number; why?: string;
  followed: boolean; helpful: 'up'|'down'|null;
}

interface TrendPoint { ts: string; value: number; }
interface TrendResponse { username:string; metric:string; granularity:string; average:number|null; variationPct:number; points:TrendPoint[]; }
type MetricKey = 'spo2'|'hrv'|'sleep'|'steps';
type RangeKey = 'today'|'7d'|'30d'|'custom';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {

  // ===== Overview state =====
  latest?: HealthData;
  lastSync?: Date;
  Math = Math;
  stepsGoal = 10000;
  private sub: any;

  // ===== Tabs =====
  active: TabKey = 'trends';
  setTab(t: TabKey) {
    // NEW: if AI tab clicked but AI is disabled, just ignore (HTML also disables)
    if (t === 'insights' && !this.aiEnabled) return;
    this.active = t;
    if (t === 'trends') this.onEnterTrends();
  }

  // ===== Insights state =====
  insights: InsightDTO | null = null;
  cards: InsightCardVM[] = [];
  recs: RecommendationVM[] = [];
  loadingInsights = true;
  insightsError: string | null = null;
  private insightsStomp?: Client;

  // NEW: consent-driven flags
  aiEnabled = false;
  notificationsEnabled = false;
  private insightsStompActive = false;

  // ===== Trends state =====
  metrics: MetricKey[] = ['spo2','hrv','sleep','steps'];
  selectedMetric: MetricKey = 'spo2';
  selectedRange: RangeKey = '7d';
  customStart?: string;
  customEnd?: string;

  trendMap: Record<MetricKey, TrendResponse | null> = { spo2: null, hrv: null, sleep: null, steps: null };
  trendLoading = false;
  trendError: string | null = null;

  chartMode: 'line'|'area'|'bar' = 'area';
  smoothing = 0.35;

  lineData: any = { datasets: [] };
  lineOpts: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: '#cdd2de' } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { ticks: { color: '#cdd2de' }, grid: { color:'rgba(255,255,255,.08)' }},
      y: { ticks: { color: '#cdd2de' }, grid: { color:'rgba(255,255,255,.08)' }, beginAtZero: false }
    },
    elements: { point: { radius: 2 } }
  };

  @ViewChild('bigChartRef') bigChartRef?: BaseChartDirective;

  constructor(
    private api: HealthDataApiService,
    private rt: WebSocketService,
    private auth: AuthService,
    private http: HttpClient,
    private consentGate: ConsentGateService
  ) {}

  ngOnInit(): void {
    const username = (this.auth.getUsername() || '').replace(/^"+|"+$/g, '');
    if (!username) return;

    // Overview initial
    this.api.getLatest(username).subscribe(d => {
      this.latest = d || undefined;
      this.lastSync = d ? new Date(d.receivedDate) : undefined;
    });

    // Overview realtime
    this.rt.connect(username);
    this.sub = this.rt.updates$().subscribe(d => {
      this.latest = d;
      this.lastSync = new Date(d.receivedDate);
    });

    // NEW: consent-driven AI behavior
    this.consentGate.hasScopes$().subscribe(scopes => {
      const ai = scopes.has('AI_INSIGHTS');
      const notif = scopes.has('NOTIFICATIONS');
      this.notificationsEnabled = notif;

      if (ai && !this.aiEnabled) {
        // just turned ON → fetch + connect
        this.aiEnabled = true;
        this.fetchLatestInsights(username);
        this.connectInsightsWS(username);
      } else if (!ai && this.aiEnabled) {
        // just turned OFF → clean up
        this.aiEnabled = false;
        this.insightsStomp?.deactivate();
        this.insightsStompActive = false;
        this.insights = null;
        this.cards = [];
        this.recs = [];
      }
    });

    // NOTE: removed unconditional fetch/connect here; it’s now consent-gated above
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.rt.disconnect();
    this.insightsStomp?.deactivate();
  }

  // ===== Overview helpers =====
  clamp0to100(v: number | null | undefined): number { const n = v ?? 0; return Math.max(0, Math.min(100, n)); }
  progress(v: number | null | undefined, goal = 100): number { const n = v ?? 0; if (goal <= 0) return 0; return Math.max(0, Math.min(100, (n / goal) * 100)); }
  spo2StatusClass(v: number | null | undefined): 'ok'|'warning'|'danger'|'neutral' { if (v == null) return 'neutral'; if (v <= 92) return 'danger'; if (v <= 94) return 'warning'; return 'ok'; }

  // ===== Insights =====
  private fetchLatestInsights(username: string) {
    this.loadingInsights = true; this.insightsError = null;
    this.http.get<InsightDTO | null>(`${environment.url}/health/insights/${encodeURIComponent(username)}/latest`)
      .subscribe({
        next: (dto) => {
          if (dto) {
            this.insights = dto;
            this.lastSync = dto.generatedAt ? new Date(dto.generatedAt) : this.lastSync;
            this.rebuildVM();
          }
          this.loadingInsights = false;
        },
        error: _ => { this.insightsError = 'Failed to load AI insights'; this.loadingInsights = false; }
      });
  }

  private connectInsightsWS(username: string) {
    if (this.insightsStompActive) return;
    this.insightsStomp = new Client({ webSocketFactory: () => new SockJS(environment.wsUrl), reconnectDelay: 3000 });
    this.insightsStomp.onConnect = () => {
      this.insightsStompActive = true;
      this.insightsStomp!.subscribe(`/queue/insights/${username}`, (m: IMessage) => {
        const dto = JSON.parse(m.body) as InsightDTO;
        this.insights = dto;
        this.lastSync = dto.generatedAt ? new Date(dto.generatedAt) : this.lastSync;
        this.rebuildVM();
      });
    };
    this.insightsStomp.onStompError = () => { this.insightsStompActive = false; };
    this.insightsStomp.onWebSocketClose = () => { this.insightsStompActive = false; };
    this.insightsStomp.activate();
  }

  private rebuildVM() {
    if (!this.insights) { this.cards = []; this.recs = []; return; }
    this.cards = this.deriveCards(this.insights);
    this.recs  = this.deriveRecs(this.insights);
  }
  private deriveCards(d: InsightDTO): InsightCardVM[] {
    const out: InsightCardVM[] = [];
    const last3 = 'Last 3 days'; const thisWeek = 'This week';
    if (d.fatigueRisk >= 40) out.push({ title:'Fatigue Risk Detected', subtitle:'HRV decline & low recovery', status: d.fatigueRisk>=70?'danger':'warn', timeframe:last3, confidence:Math.min(100,Math.max(60,d.fatigueRisk)), icon:'⚠️' });
    if ((d.spo2 ?? 100) < 94) out.push({ title:'SpO₂ Below Baseline', subtitle:'Oxygen saturation trending low', status:'danger', timeframe:last3, confidence:Math.min(100,Math.max(60,d.respiratoryRisk)), icon:'❌' });
    if (d.trendNotes.some(n=>/sleep.*improv/i.test(n))) out.push({ title:'Sleep Duration Improving', subtitle:'More sleep this week', status:'success', timeframe:thisWeek, confidence:75, icon:'✅' });
    if (d.trendNotes.some(n=>/activity/i.test(n))) out.push({ title:'Activity Pattern Change', subtitle:'Activity ↔ symptoms correlation', status:'warn', timeframe:'Last 7 days', confidence:82, icon:'📊' });
    if (!out.length) out.push({ title: d.summary || 'Stable condition', subtitle:'AI summary', status: d.overallRisk>=70?'danger': d.overallRisk>=40?'warn':'info', timeframe:'Today', confidence:d.overallRisk, icon:'🧠' });
    return out.slice(0, 4);
  }
  private deriveRecs(d: InsightDTO): RecommendationVM[] {
    const recs: RecommendationVM[] = [];
    if (d.fatigueRisk >= 40) recs.push({ id:'rest', title:'Prioritize Rest Today', rationale:`HRV below baseline${d.bodyBattery!=null?` & recovery (${d.bodyBattery}%) low`:''}.`, action:'2–3 rest breaks (15m); avoid high-intensity.', confidence:Math.max(70,d.fatigueRisk), why:'HRV + recovery', followed:false, helpful:null });
    if ((d.spo2 ?? 100) < 94 || d.respiratoryRisk >= 40) recs.push({ id:'avoid-intense', title:'Avoid Intense Activity', rationale:'SpO₂ variability suggests respiratory strain.', action:'Limit to light walking; do paced breathing.', confidence:Math.max(70,d.respiratoryRisk), why:'SpO₂ + respiration trend', followed:false, helpful:null });
    if (d.trendNotes.some(n=>/sleep/i.test(n)) || (d.bodyBattery ?? 100) < 50) recs.push({ id:'earlier-bed', title:'Earlier Bedtime', rationale:'Helps circadian alignment.', action:'In bed before 23:00; screens off 60m prior.', confidence:76, why:'Sleep notes', followed:false, helpful:null });
    if (!recs.length) recs.push({ id:'maintain', title:'Maintain Gentle Progress', rationale:'Risks are low today.', action:'Steady routine; hydrate; light activity.', confidence:68, why:'Low overall risk', followed:false, helpful:null });
    return recs;
  }
  markFollowed(r: RecommendationVM){ r.followed = !r.followed; }
  vote(r: RecommendationVM, v:'up'|'down'){ r.helpful = (r.helpful===v? null : v); }
  t(iso?: string){ return iso ? dayjs(iso).format('HH:mm') : '—'; }
  chip(n?: number){ n=n??0; return n>=70?'chip danger': n>=40?'chip warn':'chip ok'; }

  // ===== Trends =====
  onEnterTrends(){ if (!this.trendMap.spo2) this.loadAllTrends(); }

  loadAllTrends() {
    const username = (this.auth.getUsername() || '').replace(/^"+|"+$/g, '');
    this.trendLoading = true; this.trendError = null;

    const calls = {
      spo2: this.api.getTrends(username, 'spo2', this.selectedRange, this.customStart, this.customEnd),
      hrv:  this.api.getTrends(username, 'hrv',  this.selectedRange, this.customStart, this.customEnd),
      sleep:this.api.getTrends(username, 'sleep',this.selectedRange, this.customStart, this.customEnd),
      steps:this.api.getTrends(username, 'steps',this.selectedRange, this.customStart, this.customEnd),
    };

    forkJoin(calls).subscribe({
      next: (res: any) => {
        this.trendMap.spo2 = res.spo2;
        this.trendMap.hrv  = res.hrv;
        this.trendMap.sleep= res.sleep;
        this.trendMap.steps= res.steps;
        this.buildBig();
        this.trendLoading = false;
      },
      error: _ => { this.trendError = 'Failed to load trends'; this.trendLoading = false; }
    });
  }

  onRangeClick(r: RangeKey){ this.selectedRange = r; this.loadAllTrends(); }
  onCustomApply(){ if (this.selectedRange!=='custom') this.selectedRange='custom'; this.loadAllTrends(); }
  onMetricClick(m: MetricKey){ this.selectedMetric = m; this.buildBig(); }
  setChartMode(mode:'line'|'area'|'bar'){ this.chartMode = mode; this.buildBig(); }

  private chartType(): ChartType { return this.chartMode === 'bar' ? 'bar' : 'line'; }
  private chartFill(): boolean { return this.chartMode === 'area'; }
  private pointColors(metric: MetricKey, values: number[]): string[] {
    return values.map(v => this.colorForMetric(metric, v));
  }
  private colorForMetric(metric: MetricKey, v: number): string {
    if (metric === 'spo2')  return v < 90 ? '#ef4444' : (v < 95 ? '#f59e0b' : '#16a34a');
    if (metric === 'hrv')   return v < 40 ? '#ef4444' : (v < 60 ? '#f59e0b' : '#16a34a');
    if (metric === 'sleep') return v < 50 ? '#ef4444' : (v < 70 ? '#f59e0b' : '#16a34a');
    if (metric === 'steps') return v < 3000 ? '#ef4444' : (v < 7000 ? '#f59e0b' : '#16a34a');
    return '#60a5fa';
  }
  private seriesColor(metric: MetricKey): { stroke:string; fill:string } {
    switch (metric) {
      case 'spo2':  return { stroke:'#34d399', fill:'rgba(52,211,153,.25)' };
      case 'hrv':   return { stroke:'#60a5fa', fill:'rgba(96,165,250,.25)' };
      case 'sleep': return { stroke:'#a78bfa', fill:'rgba(167,139,250,.25)' };
      case 'steps': return { stroke:'#f59e0b', fill:'rgba(245,158,11,.25)' };
    }
  }

  buildBig() {
    const tr = this.trendMap[this.selectedMetric];
    if (!tr) { this.lineData = { datasets: [] }; return; }
    const labels = tr.points.map(p => dayjs(p.ts).format(tr.granularity==='DAILY'?'MMM D':'MMM D HH:mm'));
    const values = tr.points.map(p => p.value);
    const colors = this.pointColors(this.selectedMetric, values);
    const c = this.seriesColor(this.selectedMetric);

    this.lineData = {
      labels,
      datasets: [{
        label: this.metricLabel(this.selectedMetric),
        data: values,
        borderColor: c.stroke,
        backgroundColor: this.chartFill() ? c.fill : c.stroke,
        fill: this.chartFill(),
        tension: this.chartType()==='line' ? this.smoothing : 0,
        pointRadius: 2,
        pointBackgroundColor: colors,
        borderWidth: 2
      }]
    };
    setTimeout(() => this.bigChartRef?.chart?.update(), 0);
  }

  metricLabel(m: MetricKey) {
    switch (m) {
      case 'spo2': return 'SpO₂ (%)';
      case 'hrv': return 'HRV (ms)';
      case 'sleep': return 'Sleep proxy (Body Battery %)';
      case 'steps': return 'Steps';
    }
  }

  // ===== PDF =====
  async exportTrendsReport() {
    const { jsPDF } = await import('jspdf');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const autoTable = (await import('jspdf-autotable')).default;

    const pdf = new jsPDF('p','mm','a4');
    const pageW = pdf.internal.pageSize.getWidth();

    const username = (this.auth.getUsername() || '').replace(/^"+|"+$/g, '');
    const rangeText = this.selectedRange === 'custom'
      ? `${this.customStart || '—'} → ${this.customEnd || '—'}`
      : this.selectedRange === 'today' ? 'Today' : this.selectedRange === '7d' ? 'Last 7 Days' : 'Last 30 Days';

    pdf.setFillColor(18, 32, 64); pdf.rect(0,0,pageW,28,'F');
    pdf.setTextColor(255); pdf.setFontSize(16); pdf.text('CovidYouNot • Health Trends Report', 12, 18);
    pdf.setTextColor(20);  pdf.setFontSize(11);
    pdf.text(`User: ${username}`, 12, 38);
    pdf.text(`Range: ${rangeText}`, 12, 45);
    pdf.text(`Generated: ${dayjs().format('YYYY-MM-DD HH:mm')}`, 12, 52);

    const kpiRows = this.metrics.map(m => {
      const tr = this.trendMap[m];
      return [
        this.metricLabel(m),
        tr?.average != null ? tr.average.toFixed(1) : '—',
        tr ? `${(tr.variationPct).toFixed(1)}%` : '—'
      ];
    });

    autoTable(pdf, {
      startY: 60,
      head: [['Metric', 'Average', 'Variation']],
      body: kpiRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [96, 165, 250] }
    });

    for (const m of this.metrics) {
      pdf.addPage();
      const prevMetric = this.selectedMetric;
      this.selectedMetric = m;
      this.buildBig();
      await new Promise(r => setTimeout(r, 150));

      pdf.setTextColor(20); pdf.setFontSize(14);
      pdf.text(`${this.metricLabel(m)}`, 12, 18);

      const tr = this.trendMap[m];
      pdf.setFontSize(10);
      const avgTxt = tr?.average != null ? tr.average.toFixed(1) : '—';
      const varTxt = tr ? `${(tr.variationPct).toFixed(1)}%` : '—';
      pdf.text(`Average: ${avgTxt}   Variation: ${varTxt}`, 12, 26);

      pdf.setFontSize(9);
      pdf.setDrawColor(0);
      pdf.setFillColor(22,163,74); pdf.rect(12, 31, 3, 3, 'F'); pdf.text('Normal', 17, 34);
      pdf.setFillColor(245,158,11); pdf.rect(42, 31, 3, 3, 'F'); pdf.text('Low', 47, 34);
      pdf.setFillColor(239,68,68); pdf.rect(66, 31, 3, 3, 'F'); pdf.text('Critical', 71, 34);

      const bigCanvas = this.bigChartRef?.chart?.canvas as HTMLCanvasElement | undefined;
      if (bigCanvas) {
        const img = bigCanvas.toDataURL('image/png');
        const imgW = pageW - 24; const imgH = 120;
        pdf.addImage(img, 'PNG', 12, 40, imgW, imgH);
      }

      pdf.setFontSize(10);
      const y = 170;
      const guidance = {
        spo2:  'Aim to keep SpO₂ ≥ 95%. If persistently < 94%, rest and consider medical advice.',
        hrv:   'Falling HRV + fatigue may indicate overexertion. Prefer low-intensity activity.',
        sleep: 'Consistent sleep improves recovery. Target earlier bedtime and reduce screens.',
        steps: 'Increase gradually; avoid sudden jumps. Track how activity affects fatigue.'
      }[m as keyof typeof arguments]; // just to satisfy TS; content is static
      pdf.text(guidance as string, 12, y, { maxWidth: pageW - 24 });

      this.selectedMetric = prevMetric;
      this.buildBig();
      await new Promise(r => setTimeout(r, 50));
    }

    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(120);
      pdf.text(`Page ${i} of ${pageCount}`, pageW - 30, 290);
    }

    pdf.save(`Trends_${username}_${dayjs().format('YYYYMMDD_HHmm')}.pdf`);
  }
}
