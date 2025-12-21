import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthService } from 'src/app/service/google-service/google-auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  rememberMe = signal(false);

  constructor(
    private googleAuthService: GoogleAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is already logged in via remember me
    if (this.googleAuthService.loginStateSignal()) {
      // User is already logged in, could redirect to home if needed
      this.router.navigate(['/home']);
    }
  }

  toggleRememberMe() {
    this.rememberMe.set(!this.rememberMe());
    this.googleAuthService.setRememberMe(this.rememberMe());
  }
}
