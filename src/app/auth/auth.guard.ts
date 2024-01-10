import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem("jwtToken");
  const router = inject(Router);
  const authService = inject(AuthService);
  if(token) {
    const role = route.data["roles"] as Array<string>;

    if(role) {
      const isMatch = authService.roleMatch(role);

      if(isMatch) {
        return true;
      } else {
        router.navigate(['/forbidden']);
      }
    }
  } else {
    router.navigate(['login']);
    return false;

  }
  return true;
};