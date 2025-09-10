import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as dayjs from "dayjs";
import { environment } from "src/environments/environments";
import { HealthData } from "../models/appconstants/health";

type MetricKey = 'spo2'|'hrv'|'sleep'|'steps';
type RangeKey  = 'today'|'7d'|'30d'|'custom';

export interface TrendPoint { ts: string; value: number; }
export interface TrendResponse {
  username:string; metric:string; granularity:string;
  average:number|null; variationPct:number; points:TrendPoint[];
}

@Injectable({ providedIn: 'root' })
export class HealthDataApiService {
  constructor(private http: HttpClient) {}

  getLatest(username: string) {
    return this.http.get<HealthData>(`${environment.url}/health/${encodeURIComponent(username)}/latest`);
  }

  getTrends(
    username: string,
    metric: MetricKey,
    range: RangeKey,
    start?: string,  // from <input type="datetime-local">
    end?: string
  ) {
    const granularity = range === 'today' ? 'HOURLY' : 'DAILY';

    let params = new HttpParams()
      .set('metric', metric)
      .set('range', range)
      .set('granularity', granularity);

    if (range === 'custom' && start && end) {
      // convert local to ISO; stays in query params (no headers)
      params = params
        .set('start', dayjs(start).toISOString())
        .set('end',   dayjs(end).toISOString());
    }

    return this.http.get<TrendResponse>(
      `${environment.url}/health/${encodeURIComponent(username)}/trends`,
      { params } // <-- no headers
    );
  }
}
