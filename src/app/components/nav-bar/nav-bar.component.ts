import { Component, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { GoogleAuthService } from 'src/app/service/google-service/google-auth.service';
import { DriveService } from 'src/app/service/google-service/drive.service';
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
    private driveService: DriveService
  ) {}

  onLogIn() {
    this.googleAuthService.signIn();
  }

  onLogOut() {
    this.googleAuthService.signOut();
    this.router.navigate(['/login'], { state: { reload: false } });
  }

  getList() {
    this.driveService.getWorkingFile();
  }

  onClick() {
    if (!this.googleAuthService.loginStateSignal()) {
      this.onLogIn();
    } else {
      this.onLogOut();
    }
  }
}
