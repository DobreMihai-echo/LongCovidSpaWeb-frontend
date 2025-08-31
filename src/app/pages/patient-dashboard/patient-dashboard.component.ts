import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/configs/websocket.service';
import { HealthData } from 'src/app/models/appconstants/health';
import { AuthService } from 'src/app/services/auth.service';
import { HealthDataApiService } from 'src/app/services/health.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit, OnDestroy {
  latest?: HealthData;
  lastSync?: Date;
  Math = Math;
  stepsGoal = 10000;

  private sub: any;

  constructor(private api: HealthDataApiService, private rt: WebSocketService, private auth: AuthService) {}

  ngOnInit(): void {
    // initial paint from DB
    this.api.getLatest(this.auth.getUsername()!).subscribe(d => {
      this.latest = d || undefined;
      this.lastSync = d ? new Date(d.receivedDate) : undefined;
    });
    // realtime
    this.rt.connect(this.auth.getUsername()! /*, tokenIfYouHaveOne */);
    this.sub = this.rt.updates$().subscribe(d => {
      this.latest = d;
      this.lastSync = new Date(d.receivedDate);
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); this.rt.disconnect(); }

clamp0to100(v: number | null | undefined): number {
  const n = v ?? 0;
  return Math.max(0, Math.min(100, n));
}

// generic progress (0–100%) for any metric vs goal
progress(v: number | null | undefined, goal = 100): number {
  const n = v ?? 0;
  if (goal <= 0) return 0;
  return Math.max(0, Math.min(100, (n / goal) * 100));
}

// class for SpO2 card state
spo2StatusClass(v: number | null | undefined): 'ok'|'warning'|'danger'|'neutral' {
  if (v == null) return 'neutral';
  if (v <= 92) return 'danger';
  if (v <= 94) return 'warning';
  return 'ok';
}
}
