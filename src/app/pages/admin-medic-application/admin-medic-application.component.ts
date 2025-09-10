import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminMedicService, MedicApplication, Page } from 'src/app/services/admin-medic.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
type UserLite = { id:number; email:string; firstName:string; lastName:string };

@Component({
  selector: 'app-admin-medic-applications',
  templateUrl: './admin-medic-application.component.html',
  styleUrls: ['./admin-medic-application.component.css']
})
export class AdminMedicApplicationComponent implements OnInit {
  status: 'PENDING'|'APPROVED'|'REJECTED' = 'PENDING';
  page: Page<MedicApplication> | null = null;
  loading = true; error: string | null = null;
  selected: MedicApplication | null = null;
  rejectReason = '';

  patientQuery = '';
  searchPage: Page<UserLite> | null = null;
  assignedPage: Page<UserLite> | null = null;

assigningId: number | null = null;
unassigningId: number | null = null;

  constructor(private api:AdminMedicService){}

  ngOnInit(){ this.load(); }
  load(p=0){ this.loading = true; this.error=null;
    this.api.list(this.status, p, 20).subscribe({
      next: pg => { this.page = pg; this.loading = false; },
      error: _ => { this.error='Failed to load applications'; this.loading=false; }
    });
  }
  open(app:MedicApplication){ this.selected = app; this.rejectReason=''; }
  close(){ this.selected = null; }
  approve(id:number){
    this.api.approve(id).subscribe({
      next: app => { this.replace(app); this.selected = app; },
      error: _ => alert('Approve failed')
    });
  }
  reject(id:number){
    if(!this.rejectReason.trim()){ alert('Please enter a reason'); return; }
    this.api.reject(id, this.rejectReason.trim()).subscribe({
      next: app => { this.replace(app); this.selected = app; },
      error: _ => alert('Reject failed')
    });
  }
  replace(updated:MedicApplication){
    if(!this.page) return;
    this.page.content = this.page.content.map(x => x.id===updated.id ? updated : x);
  }
  trackById(_: number, app: MedicApplication): number {
  return app.id; // must be unique & stable
  }

  loadAssigned(p=0){
  if(!this.selected) return;
  this.api.listDoctorPatients(this.selected.userId, p, 10).subscribe({
    next: pg => this.assignedPage = pg
  });
}

searchPatients(p=0){
  this.api.searchPatients(this.patientQuery, p, 10).subscribe({
    next: pg => this.searchPage = pg
  });
}

isAssigned(id:number){ return !!this.assignedPage?.content.some(x => x.id === id); }

assign(patientId:number, $event?:Event){
  $event?.stopPropagation();
  if(!this.selected || this.isAssigned(patientId)) return;
  this.assigningId = patientId;

  this.api.assignPatient(this.selected.userId, patientId).subscribe({
    next: () => {
      // optimistic add (no full reload)
      const p = this.searchPage?.content.find(x => x.id === patientId);
      if(p){
        this.assignedPage = this.assignedPage ?? { content: [], totalElements: 0, totalPages: 1, number: 0, size: 10 };
        this.assignedPage.content.unshift(p);
        this.assignedPage.totalElements++;
      }
      this.assigningId = null;
    },
    error: _ => { this.assigningId = null; alert('Assign failed'); }
  });
}

unassign(patientId:number, $event?:Event){
  $event?.stopPropagation();
  if(!this.selected) return;
  this.unassigningId = patientId;

  this.api.unassignPatient(this.selected.userId, patientId).subscribe({
    next: () => {
      if(this.assignedPage){
        this.assignedPage.content = this.assignedPage.content.filter(x => x.id !== patientId);
        this.assignedPage.totalElements = Math.max(0, this.assignedPage.totalElements - 1);
      }
      this.unassigningId = null;
    },
    error: _ => { this.unassigningId = null; alert('Unassign failed'); }
  });
}
  trackByUserId(_: number, u: UserLite){ return u.id; }

  @HostListener('document:keydown.escape')
  onEsc(){ if (this.selected) this.close(); }
}

