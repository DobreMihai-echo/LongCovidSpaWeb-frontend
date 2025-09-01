import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConsentRecord, PrivacyApiService } from './privacy.service';

@Injectable({ providedIn: 'root' })
export class ConsentGateService {
  // keep in sync with backend policy/version
  private requiredVersion = '2025-09-01';
  private requiredScopes = ['HEALTH_PROCESSING']; // add 'AI_INSIGHTS' if you want to hard-require AI too

  constructor(private privacy: PrivacyApiService) {}

  hasScopes$() {
  return this.privacy.getLatestConsent().pipe(
    map(c => new Set<string>(c?.withdrawnAt ? [] : (c?.scopes || [])))
  );
}

  hasValidConsent$(): Observable<boolean> {
    return this.privacy.getLatestConsent().pipe(
      map((c: ConsentRecord | null) => {
        if (!c || c.withdrawnAt) return false;
        if (c.policyVersion !== this.requiredVersion) return false;
        const s = new Set(c.scopes || []);
        return this.requiredScopes.every(scope => s.has(scope));
      })
    );
  }
}