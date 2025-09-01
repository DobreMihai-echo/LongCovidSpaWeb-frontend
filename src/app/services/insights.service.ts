import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

export interface InsightDTO {
  username: string; generatedAt: string;
  overallRisk: number; respiratoryRisk: number; fatigueRisk: number; activityRisk: number;
  summary: string; trendNotes: string[];
  spo2: number|null; respirationsPerMinute: number|null; steps: number|null; bodyBattery: number|null; heartRateVariability: number|null;
}

@Injectable({ providedIn: 'root' })
export class InsightsApiService {
  constructor(private http: HttpClient) {}
  getLatest(username: string) {
    return this.http.get<InsightDTO>(`${environment.url}/health/insights/${encodeURIComponent(username)}/latest`, { observe: 'response' });
  }
}