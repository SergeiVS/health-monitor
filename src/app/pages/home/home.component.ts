import { Component, OnInit, signal } from '@angular/core';
import { BloodPresureInputForm } from '../../components/indicators-input/idicators-input.component';
import { GoogleAuthService } from 'src/app/service/google-service/google-auth.service';
import { DriveService } from 'src/app/service/google-service/drive.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [BloodPresureInputForm],
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: GoogleAuthService,
    private driveService: DriveService
  ) {}

  ngOnInit() {
    if (this.authService.loginStateSignal()) {
      if (
        localStorage.getItem(environment.TABLE_TITLE_STORAGE_KEY) === null ||
        localStorage.getItem(environment.TABLE_TITLE_STORAGE_KEY) === undefined
      ) {
        this.driveService.getWorkingFile();
      } else {
        console.log(
          'Table id: ' + localStorage.getItem(environment.TABLE_TITLE_STORAGE_KEY)
        );
      }
    } else {
      console.log('You are logged on: ' + this.authService.loginStateSignal());
    }
  }

  title = signal(`Home page`);
}
