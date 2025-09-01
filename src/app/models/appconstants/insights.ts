export interface InsightCard {
  id: 'fatigue'|'resp'|'sleep'|'activity'|string;
  title: string;
  severity: 'danger'|'warning'|'success'|'info'|string;
  timeframe: string;
  confidence: number;
  details: string;
}

export interface Recommendation {
  title: string;
  body: string;
  confidence: number;
  rationale: string;
  tag: string;
}

export interface InsightDTO {
  username: string;
  generatedAt: string;
  overallRisk: number;
  respiratoryRisk: number;
  fatigueRisk: number;
  activityRisk: number;
  summary: string;
  trendNotes: string[];
  spo2: number;
  respirationsPerMinute: number;
  heartRateVariability: number;
  bodyBattery: number;
  steps: number;
  cards: InsightCard[];
  recommendations: Recommendation[];
}
