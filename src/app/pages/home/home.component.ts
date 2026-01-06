import { Component, inject, OnInit } from '@angular/core';
import { IndicatorsInputComponent } from '../../components/indicators-input/indicators-input.component';
import { GoogleAuthService } from 'src/app/service/google-service/google-auth.service';
import { DriveService } from 'src/app/service/google-service/drive.service';
import { SheetStateService } from 'src/app/service/sheet-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IndicatorsInputComponent],
})
export class HomeComponent implements OnInit {
private authService = inject(GoogleAuthService);
private driveService = inject(DriveService);
private sheetStateService = inject(SheetStateService);

  constructor() {}

  async ngOnInit() {
    if (this.authService.loginStateSignal()) {
      if (this.sheetStateService.getSpreadsheetId() === '') {
        await this.driveService.getWorkingFile();
      }
    }
  }
}
