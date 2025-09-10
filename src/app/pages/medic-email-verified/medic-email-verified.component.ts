import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-medic-email-verified',
  template: `
  <app-navbar></app-navbar>
  <div class="shell">
    <div class="card">
      <h2>Work email verification</h2>
      <p *ngIf="state==='loading'">Verifying…</p>
      <p *ngIf="state==='ok'" class="ok">Your work email is verified. We’ll notify you after review.</p>
      <p *ngIf="state==='err'" class="err">Verification failed. The link may be invalid or expired.</p>
    </div>
  </div>`,
  styles:[`.shell{max-width:720px;margin:90px auto 40px;padding:0 16px}.card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:16px;color:#fff}.ok{color:#22c55e}.err{color:#fca5a5}`]
})
export class MedicEmailVerifiedComponent implements OnInit {
  state: 'loading'|'ok'|'err' = 'loading';
  constructor(private ar:ActivatedRoute, private http:HttpClient) {}
  ngOnInit(){
    const token = this.ar.snapshot.queryParamMap.get('token');
    if(!token){ this.state='err'; return; }
    this.http.get(`${environment.url}/medic/verify-email`, { params:{ token } })
      .subscribe({ next: _ => this.state='ok', error: _ => this.state='err' });
  }
}
