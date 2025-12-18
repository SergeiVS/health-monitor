import { Component, OnInit, signal } from '@angular/core';
import { GoogleAuthService } from 'src/app/service/google-service/google-auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  rememberMe = signal(false);

  constructor(private googleAuthService: GoogleAuthService) {}

  ngOnInit() {
    // Check if user is already logged in via remember me
    if (this.googleAuthService.loginStateSignal()) {
      // User is already logged in, could redirect to home if needed
    }
  }


  toggleRememberMe() {
    this.rememberMe.set(!this.rememberMe());
    this.googleAuthService.setRememberMe(this.rememberMe())
  }
}
