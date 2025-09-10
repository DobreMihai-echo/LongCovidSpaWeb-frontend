import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';

export interface MedicApplication {
  id: number;
  userId: number;
  providerDirectoryId?: number | null;
  licenseNumber: string;
  licenseIssuer: string;
  workEmail: string;
  status: 'PENDING'|'APPROVED'|'REJECTED';
  submittedAt: string;
  reviewedBy?: number | null;
  reviewedAt?: string | null;
  rejectReason?: string | null;
  emailVerified?: boolean;
  docUrls: string[];
}

export interface Page<T> { content:T[]; totalElements:number; totalPages:number; size:number; number:number; }

@Injectable({
  providedIn: 'root'
})
export class AdminMedicService {
  private base = `${environment.url}/admin/medics`;
  constructor(private http:HttpClient){}

  list(status:'PENDING'|'APPROVED'|'REJECTED'='PENDING', page=0, size=20): Observable<Page<MedicApplication>> {
    const params = new HttpParams().set('status', status).set('page', page).set('size', size);
    return this.http.get<Page<MedicApplication>>(`${this.base}/applications`, { params });
  }
  get(id:number){ return this.http.get<MedicApplication>(`${this.base}/applications/${id}`); }
  approve(id:number){ return this.http.post<MedicApplication>(`${this.base}/applications/${id}/approve`, {}); }
  reject(id:number, reason:string){ return this.http.post<MedicApplication>(`${this.base}/applications/${id}/reject`, { reason }); }

  listDoctorPatients(medicUserId: number, page = 0, size = 20) {
  return this.http.get<Page<{id:number; email:string; firstName:string; lastName:string}>>(
    `${this.base}/${medicUserId}/patients`, { params: new HttpParams().set('page', page).set('size', size) }
  );
}

searchPatients(q = '', page = 0, size = 20) {
  const params = new HttpParams().set('q', q).set('page', page).set('size', size);
  return this.http.get<Page<{id:number; email:string; firstName:string; lastName:string}>>(
    `${this.base}/patients/search`, { params }
  );
}

assignPatient(medicUserId: number, patientId: number) {
  return this.http.post<void>(`${this.base}/${medicUserId}/patients/${patientId}`, {});
}

unassignPatient(medicUserId: number, patientId: number) {
  return this.http.delete<void>(`${this.base}/${medicUserId}/patients/${patientId}`);
}
}
