import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';

export interface ConsentRecord {
  id:number; userId:number; policyVersion:string; textHash:string;
  scopes:string[]; grantedAt:string; withdrawnAt?:string|null;
}
@Injectable({ providedIn: 'root' })
export class PrivacyApiService {
  private base = `${environment.url}/privacy`;
  constructor(private http:HttpClient){}

  getConsents() { return this.http.get<ConsentRecord[]>(`${this.base}/consents`); }
  giveConsent(scopes:string[], policyVersion:string, textHash:string){
    return this.http.post<ConsentRecord>(`${this.base}/consents`, { scopes, policyVersion, textHash });
  }
  withdrawConsent(){ return this.http.post<ConsentRecord>(`${this.base}/consents`, { withdraw:true }); }

  requestExport(){ return this.http.post<{jobId:string}>(`${this.base}/export`, {}); }
  getExport(jobId:string){ return this.http.get<any>(`${this.base}/export/${jobId}`); }
  requestErase(){ return this.http.post<any>(`${this.base}/erase`, {}); }
   getLatestConsent(): Observable<ConsentRecord | null> {
    return this.http.get<ConsentRecord | null>(`${this.base}/consents/latest`);
  }
}