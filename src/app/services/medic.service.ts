import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';

export interface MedicApplication {
  id:number; userId:number; providerDirectoryId?:number;
  licenseNumber:string; licenseIssuer:string; workEmail:string;
  status:'PENDING'|'APPROVED'|'REJECTED';
  submittedAt:string; reviewedBy?:number; reviewedAt?:string;
  rejectReason?:string; emailVerified:boolean;
}

@Injectable({ providedIn: 'root' })
export class MedicService {
  private base = `${environment.url}/medic`;
  private admin = `${environment.url}/admin/medics`;
  constructor(private http:HttpClient){}

  apply(payload: { licenseNumber:string; issuer:string; workEmail:string; docUrls?:string[] }) {
    return this.http.post<{status:string}>(`${this.base}/apply`, payload);
  }
  myStatus(): Observable<MedicApplication | null> {
    return this.http.get<MedicApplication | null>(`${this.base}/my-status`);
  }
  // Admin
  listApps(status='PENDING'){ return this.http.get<MedicApplication[]>(`${this.admin}/applications`, { params:{ status } }); }
  approve(id:number){ return this.http.post(`${this.admin}/${id}/approve`, {}); }
  reject(id:number, reason:string){ return this.http.post(`${this.admin}/${id}/reject`, reason, { responseType:'text' }); }
}
