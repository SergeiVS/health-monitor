import { CanActivateFn, Router } from '@angular/router';
import { GoogleAuthService } from './service/google-service/google-auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const googleAuthService: GoogleAuthService = inject(GoogleAuthService);
  const router = inject(Router);

  if (!googleAuthService.loginStateSignal()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
