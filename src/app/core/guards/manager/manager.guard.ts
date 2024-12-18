import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth.service';

export const managerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (localStorage.getItem('userToken') !== null && authService.role === 'Manager') {
    return true;
  }
  router.navigate(['/dashboard']);
  return false
};
