import { Component, OnInit, signal } from '@angular/core';
import { BloodPresureInputForm } from '../../components/indicators-input/idicators-input.component';
import { GoogleAuthService } from 'src/app/service/google-service/google-auth.service';
import { DriveService } from 'src/app/service/google-service/drive.service';
import { SheetStateService } from 'src/app/service/sheet-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [BloodPresureInputForm],
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: GoogleAuthService,
    private driveService: DriveService,
    private sheetStateService: SheetStateService
  ) {}

  async ngOnInit() {
    if (this.authService.loginStateSignal()) {
      if (this.sheetStateService.getSpredsheetId() === '') {
        await this.driveService.getWorkingFile();
      }
    } 
  }

  title = signal(`Angabe des Blutdrucks Wertes`);
}
