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

  constructor(private modalService: ModalService) {
    if (environment.TABLE_TITLE_STORAGE_KEY !== null) {
      this.storageKey = environment.TABLE_TITLE_STORAGE_KEY;
      const _spredSheet = localStorage.getItem(this.storageKey);
      if (_spredSheet !== null) {
        this.spredSheetId = _spredSheet;
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
        range: 'Sheet1!A2',
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
    if (!this.spredSheetId) {
      this.modalService.openModal(
        'Fehler',
        'Keine Tabellen-ID gefunden. Bitte stellen Sie sicher, dass Sie angemeldet sind und eine Tabelle ausgewählt haben.'
      );
      return;
    }

    // get sheetId for "Sheet1" (fallback to first sheet)
    gapi.client.sheets.spreadsheets
      .get({ spreadsheetId: this.spredSheetId })
      .then((resp: any) => {
        const sheets = resp.result.sheets as any[] | undefined;
        const sheet =
          sheets?.find((s) => s.properties?.title === 'Sheet1') || sheets?.[0];
        const sheetId = sheet?.properties?.sheetId;
        if (sheetId == null) {
          throw new Error('SheetId nicht gefunden');
        }

        const requests = [
          {
            sortRange: {
              range: {
                sheetId,
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

        return gapi.client.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spredSheetId,
          resource: { requests },
        });
      })
      .catch((err: any) => {
        console.error(err);
        this.modalService.openModal(
          'Fehler',
          'Beim Sortieren der Tabelle ist ein Fehler aufgetreten.'
        );
      });
  }
}
