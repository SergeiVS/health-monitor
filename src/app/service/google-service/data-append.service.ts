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

  constructor(
    private modalService: ModalService,
    private sheetStateService: SheetStateService
  ) {}

  public async addNewValues({ date, time, sys, dis, puls }: FormValues) {
    const _values = [[date, time, sys, dis, puls]];
    console.log('Spredsheet ID:', this.spredsheetId);
    await gapi.client.sheets.spreadsheets.values
      .append({
        valueInputOption: 'USER_ENTERED',
        spreadsheetId: this.spredsheetId(),
        insertDataOption: 'INSERT_ROWS',
        range: `${this.sheetName}!A2`,
        resource: {
          values: _values,
        },
      })
      .then(() => {
        this.sortTableValues();
        this.modalService.openModal(
          'Daten hinzugefügt',
          'Die neuen Werte wurden erfolgreich hinzugefügt.'
        );
      })
      .catch((err: any) => {
        console.error(err);
        this.modalService.openModal(
          'Fehler',
          'Beim Hinzufügen der Daten ist ein Fehler aufgetreten.'
        );
      });
  }

  public async sortTableValues() {
    if (!this.spredsheetId()) {
      this.modalService.openModal(
        'Fehler',
        'Keine Tabellen-ID gefunden. Bitte stellen Sie sicher, dass Sie angemeldet sind und eine Tabelle ausgewählt haben.'
      );
      return;
    }

    const requests: any[] = [
      {
        sortRange: {
          range: {
            sheetId: this.sheetId(),
            // start at row index 1 to keep header row (A1) intact (0-based)
            startRowIndex: 1,
            // include columns A..E (adjust endColumnIndex if you have more columns)
            startColumnIndex: 0,
            endColumnIndex: 5,
          },
          sortSpecs: [
            { dimensionIndex: 0, sortOrder: 'ASCENDING' }, // column A (date)
            { dimensionIndex: 1, sortOrder: 'ASCENDING' }, // column B (time)
          ],
        },
      },
    ];

    await gapi.client.sheets.spreadsheets
      .batchUpdate({
        spreadsheetId: this.spredsheetId(),
        resource: { requests },
      })
      .then((response: any) => {
        console.log('Table values sorted successfully:', response.result);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }
}
