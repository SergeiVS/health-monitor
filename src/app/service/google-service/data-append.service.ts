import { inject, Injectable, linkedSignal } from '@angular/core';
import { FormValues } from 'src/app/models/form-values-model';
import { environment } from 'src/environments/environment';
import { ModalService } from '../modal.service';
import { SheetStateService } from '../sheet-state.service';

@Injectable({
  providedIn: 'root',
})
export class DataAppendService {
  private modalService = inject(ModalService);
  private sheetStateService = inject(SheetStateService);

  private sheetName = environment.SHEET_NAME;
  private spredsheetId = linkedSignal(() =>
    this.sheetStateService.getSpredsheetId()
  );
  private sheetId = linkedSignal(() =>
    Number(this.sheetStateService.getSheetId())
  );

  private readonly sortingRequest = [
    {
      sortRange: {
        range: {
          sheetId: this.sheetId(),
          startRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 5,
        },
        sortSpecs: [
          { dimensionIndex: 0, sortOrder: 'ASCENDING' }, // column A (date)
          { dimensionIndex: 1, sortOrder: 'ASCENDING' },
        ],
      },
    },
  ];

  constructor() {}

  public async addNewValues({ date, time, sys, dis, pulse: puls }: FormValues) {
    const _values = [[date, time, sys, dis, puls]];

    try {
      await gapi.client.sheets.spreadsheets.values.append({
        valueInputOption: 'USER_ENTERED',
        spreadsheetId: this.spredsheetId(),
        insertDataOption: 'INSERT_ROWS',
        range: `${this.sheetName}!A2`,
        resource: {
          values: _values,
        },
      });

      await this.sortSheetValues();

      this.modalService.openModal(
        $localize`:success|@@success:Success`,
        $localize`:success|@@valuesAddedSuccessfully:Values added successfully.`
      );
    } catch (err) {
      console.error('Error adding new values:', err);
      this.modalService.openModal(
        $localize`:error|@@error:Error`,
        $localize`:error|@@errorAddingValues:An error occurred while adding the new values. Please try again.`
      );
    }
  }

  public async sortSheetValues() {
    if (!this.spredsheetId()) {
      this.modalService.openModal(
        $localize`:error|@@error:Error`,
        $localize`:error|@@spreadsheetIdNotSet:Spreadsheet ID is not set. Please configure the application correctly.`
      );
      throw new Error('Spreadsheet ID is not set.');
    }

    try {
      await gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spredsheetId(),
        resource: { requests: this.sortingRequest },
      });
    } catch (err) {
      console.error('Error sorting table values:', err);
    }
  }
}
