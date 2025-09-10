import { Component } from '@angular/core';
import { MedicService } from '../../services/medic.service';

@Component({
  selector: 'app-medic-apply',
  templateUrl: './medic-apply.component.html',
  styleUrls: ['./medic-apply.component.css']
})
export class MedicApplyComponent {
  licenseNumber = '';
  issuer = '';
  workEmail = '';
  sending = false;
  statusMsg = '';
  errorMsg = '';

  constructor(private medic: MedicService) {}

  submit() {
    this.sending = true; this.errorMsg=''; this.statusMsg='';
    this.medic.apply({ licenseNumber:this.licenseNumber, issuer:this.issuer, workEmail:this.workEmail })
      .subscribe({
        next: r => { this.sending=false; this.statusMsg = 'Application submitted. Check your work email to verify.'; },
        error: _ => { this.sending=false; this.errorMsg='Failed to submit. Please check fields and try again.'; }
      });
  }

  get emailDomainInvalid(): boolean {
  const m = this.workEmail.trim().toLowerCase().match(/@(.+)$/);
  return !!m && m[1] !== 'yahoo.com';
}
}
