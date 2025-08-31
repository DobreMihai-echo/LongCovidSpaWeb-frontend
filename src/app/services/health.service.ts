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
}