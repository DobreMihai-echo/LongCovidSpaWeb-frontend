import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ConsentGateService } from '../services/consent.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const gate = inject(ConsentGateService);

  const token = authService.getToken?.() ?? localStorage.getItem('jwtToken');
  if (!token) {
    // not logged in → send to login and preserve target
    return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
  }

  // role check (if route defines roles)
  const roles: string[] | undefined = route.data['roles'] as string[] | undefined;
  if (roles && !authService.roleMatch(roles)) {
    return router.createUrlTree(['/forbidden']);
  }

  // consent check (skip if you don’t want to require consent on this route)
  return gate.hasValidConsent$().pipe(
    map(ok => ok ? true
                 : router.createUrlTree(['/privacy'], { queryParams: { mode: 'consent', redirect: state.url } })),
    catchError(() =>
      of(router.createUrlTree(['/privacy'], { queryParams: { mode: 'consent', redirect: state.url } }))
    )
  );
};