import { Component, inject, linkedSignal } from '@angular/core';
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
  private googleAuthService = inject(GoogleAuthService);
  private router = inject(Router);
  private modalService = inject(ModalService);

  buttonTitle = linkedSignal(() => {
    if (!this.googleAuthService.loginStateSignal()) {
      return $localize`:login|@@login:Login`;
    } else {
      return $localize`:logout|@@logout:Logout`;
    }
  });

  iconName = linkedSignal(() => {
    if (!this.googleAuthService.loginStateSignal()) {
      return `login`;
    } else {
      return `logout`;
    }
  });

  constructor() {}

  onLogIn() {
    let isError = false;
    try {
      this.googleAuthService.signIn();
    } catch (err) {
      isError = true;
      this.modalService.openModal(
        $localize`:error|@@error:Error`,
        $localize`:error|@@errorLogin:Error during sign in`
      );
    }
  }

  onLogOut() {
    this.googleAuthService.signOut();
    this.modalService.openModal(
      $localize`:success|@@success:Success`,
      $localize`:success|@@successLogin:You have been logged out.`
    );
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
