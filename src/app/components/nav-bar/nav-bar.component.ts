import { Component, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { GoogleAuthService } from 'src/app/service/google-service/google-auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [CommonModule, MenuComponent, MatIconModule, MatAnchor],
})
export class NavBarComponent {
  buttonTitle = linkedSignal(() => {
    if (!this.googleAuthService.loginStateSignal()) {
      return 'Einloggen';
    } else {
      return 'Ausloggen';
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
    private modalService: ModalService
  ) {}

  onLogIn() {
    let isError = false;
    try {
      this.googleAuthService.signIn();
    } catch (err) {
      isError = true;
      this.modalService.openModal('Login Fehler', 'Fehler beim einloggen.');
    }
  }

  onLogOut() {
    this.googleAuthService.signOut();
    this.modalService.openModal('Logout Erfolgreich', 'Sie sind ausgeloggt.');
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
