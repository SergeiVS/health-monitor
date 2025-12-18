import { Injectable } from '@angular/core';
import { FormValues } from 'src/app/models/form-values-model';
import { environment } from 'src/environments/environment';
import { ModalService } from '../modal.service';

@Injectable({
  providedIn: 'root',
})
export class DataAppendService {
  private storageKey!: string;
  private spredSheetId!: string;
  private sheetName!: string;
  private sheetId!: string;
  private sheetIdStorageKey!: string;

  constructor(private modalService: ModalService) {
    if (environment.SPREADSHEET_ID_STORAGE_KEY !== null) {
      this.storageKey = environment.SPREADSHEET_ID_STORAGE_KEY;
      this.sheetName = environment.SHEET_NAME;
      this.sheetIdStorageKey = environment.SHEET_ID_STORAGE_KEY;
      const _spredSheet = localStorage.getItem(this.storageKey);
      const _sheetId = localStorage.getItem(this.sheetIdStorageKey);
      if (_spredSheet !== null) {
        this.spredSheetId = _spredSheet;
      }
      if (_sheetId !== null) {
        this.sheetId = _sheetId;
      }
    }
  }

  public addNewValues({ date, time, sys, dis, puls }: FormValues) {
    const _values = [[date, time, sys, dis, puls]];

    gapi.client.sheets.spreadsheets.values
      .append({
        valueInputOption: 'USER_ENTERED',
        spreadsheetId: this.spredSheetId,
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

  public sortTableValues() {
    console.log('Preparing to sort table values...');
    if (!this.spredSheetId) {
      this.modalService.openModal(
        'Fehler',
        'Keine Tabellen-ID gefunden. Bitte stellen Sie sicher, dass Sie angemeldet sind und eine Tabelle ausgewählt haben.'
      );
      return;
     }

    if (this.sheetId === null || this.sheetId === undefined) {
      this.setSheetId();
    }

    const requests: any[] = [
      {
        sortRange: {
          range: {
            sheetId: this.sheetId,
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

    console.log('Sorting table values...');
    gapi.client.sheets.spreadsheets
      .batchUpdate({
        spreadsheetId: this.spredSheetId,
        resource: { requests },
      })
      .then((response: any) => {
        console.log('Table values sorted successfully:', response.result);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  // get sheetId for "Sheet1" (fallback to first sheet)
  public setSheetId(): void {
    gapi.client.sheets.spreadsheets
      .get({ spreadsheetId: this.spredSheetId })
      .then((resp: any) => {
        const sheets = resp.result.sheets as any[] | undefined;
        const sheet = sheets?.find(
          (s) => s.properties?.title === this.sheetName
        );
        const id = sheet?.properties?.sheetId;
        if (id !== null) {
          localStorage.setItem(this.sheetIdStorageKey, id.toString());
          this.sheetId = id;
        } else {
          throw new Error('SheetId not found');
        }
      })
      .catch((err: any) => {
        console.error(err);
        this.modalService.openModal(
          'Fehler',
          'Beim Abrufen der Sheet-ID ist ein Fehler aufgetreten.'
        );
      });
  }
}
