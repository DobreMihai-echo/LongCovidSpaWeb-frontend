import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HealthData } from "../models/appconstants/health";
import { environment } from "src/environments/environments";

@Injectable({ providedIn: 'root' })
export class HealthDataApiService {
  constructor(private http: HttpClient) {}
  getLatest(username: string) {
    return this.http.get<HealthData>(`${environment.url}/health/${username}/latest`);
  }

    getTrends(
    username: string,
    metric: 'spo2'|'hrv'|'sleep'|'steps',
    range: 'today'|'7d'|'30d'|'custom',
    start?: string,
    end?: string,
    granularity: 'DAILY'|'HOURLY' = 'DAILY'
  ) {
    const params: any = { metric, range, granularity };
    if (range === 'custom' && start && end) { params.start = start; params.end = end; }
    return this.http.get<any>(`${environment.url}/health/${encodeURIComponent(username)}/trends`, { params });
  }
}