import { Component, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { GoogleAuthService } from 'src/app/service/google-service/google-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [CommonModule, MenuComponent, MatIconModule, MatAnchor],
})
export class NavBarComponent {
  buttonTitle = linkedSignal(() => {
    if (!this.googleAuthService.loginStateSignal()) {
      return 'Login';
    } else {
      return 'Logout';
    }
  });

  iconName = linkedSignal(() => {
    if (!this.googleAuthService.loginStateSignal()) {
      return 'login';
    } else {
      return 'logout';
    }
  });

  constructor(
    private googleAuthService: GoogleAuthService,
    private router: Router,
  ) {}

  onLogIn() {
    try {
      this.googleAuthService.signIn();
    } catch (err) {
      console.error(err);
    }
  }

  onLogOut() {
    this.googleAuthService.signOut();
    this.router.navigate(['/login'], { state: { reload: false } });
  }

  onClick() {
    if (!this.googleAuthService.loginStateSignal()) {
      this.onLogIn();
    } else {
      this.onLogOut();
    }
  }
}
