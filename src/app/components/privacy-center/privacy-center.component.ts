import { Component } from '@angular/core';
import { ConsentRecord, PrivacyApiService } from 'src/app/services/privacy.service';
import { ActivatedRoute, Router } from '@angular/router';

type Scope = 'HEALTH_PROCESSING' | 'AI_INSIGHTS' | 'NOTIFICATIONS';

@Component({
  selector: 'app-privacy-center',
  templateUrl: './privacy-center.component.html',
  styleUrls: ['./privacy-center.component.css']
})
export class PrivacyCenterComponent {

  // ui state
  loading = true;
  saving = false;
  withdrawing = false;
  banner: { kind: 'info'|'success'|'warn'|'error'; text: string } | null = null;

  // server state
  consent: ConsentRecord | null = null;

  // derived state
  isFirstVisit = true;
  policyMismatch = false;
  hasProcessingConsent = false;

  // form model
  mProcess = true;
  mAi = false;
  mNotify = false;

  // keep in sync with backend policy version
  private requiredPolicyVersion = '2025-09-01';

  constructor(
    private api: PrivacyApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();

    this.route.queryParamMap.subscribe(p => {
      const mode = p.get('mode');
      if (mode === 'consent') {
        setTimeout(() =>
          document.getElementById('consent-card')?.scrollIntoView({ behavior: 'smooth' }), 0
        );
      }
    });
  }

  // ---------- load & derive ----------
  private load() {
    this.loading = true;
    this.api.getLatestConsent().subscribe({
      next: (c) => {
        this.consent = c;
        this.deriveFrom(c);
        this.loading = false;
      },
      error: _ => {
        this.consent = null;
        this.deriveFrom(null);
        this.loading = false;
      }
    });
  }

  private deriveFrom(c: ConsentRecord | null) {
    const has = (s: Scope) => !!c?.scopes?.includes(s);
    const withdrawn = !!c?.withdrawnAt;
    this.policyMismatch = !!c && c.policyVersion !== this.requiredPolicyVersion;

    this.hasProcessingConsent = !!c && !withdrawn && has('HEALTH_PROCESSING');
    this.isFirstVisit = !c || withdrawn || this.policyMismatch || !this.hasProcessingConsent;

    if (c && !withdrawn) {
      this.mProcess = has('HEALTH_PROCESSING');
      this.mAi = has('AI_INSIGHTS');
      this.mNotify = has('NOTIFICATIONS');
    } else {
      this.mProcess = true; this.mAi = false; this.mNotify = false;
    }

    if (this.isFirstVisit) {
      this.banner = { kind: 'info', text: 'Welcome! Please review and save your consent to start using the app.' };
    } else if (this.policyMismatch) {
      this.banner = { kind: 'warn', text: 'Our privacy policy changed. Please review and save the updated consent.' };
    } else {
      this.banner = null;
    }
  }

  // ---------- actions ----------
  saveConsent() {
    this.saving = true;

    const scopes: Scope[] = [];
    if (this.mProcess) scopes.push('HEALTH_PROCESSING');
    if (this.mAi) scopes.push('AI_INSIGHTS');
    if (this.mNotify) scopes.push('NOTIFICATIONS');

    // 👇 use your giveConsent(scopes, policyVersion, textHash) signature
    this.api.giveConsent(scopes, this.requiredPolicyVersion, 'sha256:<hash-of-your-policy-doc>').subscribe({
      next: (c) => {
        this.saving = false;
        this.consent = c;
        this.deriveFrom(c);
        this.banner = { kind: 'success', text: 'Consent saved. You now have full access to the app.' };

        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        if (redirect) this.router.navigateByUrl(redirect);
      },
      error: _ => {
        this.saving = false;
        this.banner = { kind: 'error', text: 'Failed to save consent. Please try again.' };
      }
    });
  }

  withdrawConsent() {
    this.withdrawing = true;
    this.api.withdrawConsent().subscribe({
      next: (c) => {
        this.withdrawing = false;
        this.consent = c;
        this.deriveFrom(c);
        this.banner = { kind: 'success', text: 'Consent withdrawn. Data processing is paused.' };
      },
      error: _ => {
        this.withdrawing = false;
        this.banner = { kind: 'error', text: 'Failed to withdraw consent.' };
      }
    });
  }

  createZip() {
    this.api.requestExport().subscribe(_ => {
      this.banner = { kind: 'info', text: 'Export job created. Check back in a moment.' };
    });
  }

  requestDeletion() {
    // 👇 your service method is requestErase(), so call that
    this.api.requestErase().subscribe(_ => {
      this.banner = { kind: 'warn', text: 'Deletion requested. You will be notified when completed.' };
    });
  }
}
