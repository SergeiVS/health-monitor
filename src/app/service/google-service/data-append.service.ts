import { Injectable, linkedSignal } from '@angular/core';
import { FormValues } from 'src/app/models/form-values-model';
import { environment } from 'src/environments/environment';
import { ModalService } from '../modal.service';
import { SheetStateService } from '../sheet-state.service';

@Injectable({
  providedIn: 'root',
})
export class DataAppendService {
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

  constructor(
    private modalService: ModalService,
    private sheetStateService: SheetStateService
  ) {}

  public async addNewValues({ date, time, sys, dis, puls }: FormValues) {
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
        'Daten hinzugefügt',
        'Die neuen Werte wurden erfolgreich hinzugefügt.'
      );
    } catch (err) {
      console.error('Error adding new values:', err);
      this.modalService.openModal(
        'Fehler',
        'Beim Hinzufügen der neuen Werte ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      );
    }
  }

  public async sortSheetValues() {
    if (!this.spredsheetId()) {
      this.modalService.openModal(
        'Fehler',
        'Die Spreadsheet-ID ist nicht gesetzt. Bitte konfigurieren Sie die Anwendung korrekt.'
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
