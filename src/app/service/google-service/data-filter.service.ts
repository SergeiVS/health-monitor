import { Injectable } from '@angular/core';
import { FormValues } from 'src/app/models/form-values-model';
import { TimeRange } from 'src/app/models/time-range-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataFilterService {
  private storageKey!: string;
  private spredSheetId!: string;
  private sheetName!: string;
  private sheetId!: string;
  private sheetIdStorageKey!: string;

  constructor() {
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

  public async getDataFilter(timeRange: TimeRange): Promise<FormValues[]> {
    const formValues: FormValues[] = [];

    await gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: this.spredSheetId,
        range: `${this.sheetName}!A2:E`,
      })
      .then((resp: any) => {
        const values = resp.result.values;
        if (values && values.length > 0) {
          for (const row of values) {
            if (this.validateRowValues(row)) {
              const value: FormValues = {
                date: row[0],
                time: row[1],
                sys: row[2],
                dis: row[3],
                puls: row[4],
              };
              formValues.push(value);
            }
          }
        }
      });
    return this.filterDataByTimeRange(formValues, timeRange);
  }

  private filterDataByTimeRange(
    data: FormValues[],
    timeRange: TimeRange
  ): FormValues[] {
    const fromDate = new Date(timeRange.from);
    const toDate = new Date(timeRange.to);
    const filteredData = data.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= fromDate && entryDate <= toDate;
    });
    return filteredData;
  }

  private validateRowValues(row: any[]): boolean {
    return (
      row.length >= 5 &&
      this.isValidDate(row[0]) &&
      this.isValidTime(row[1]) &&
      this.isNumber(row[2]) &&
      this.isNumber(row[3]) &&
      this.isNumber(row[4])
    );
  }
  isValidDate(arg: any): boolean {
    const date = new Date(arg);
    return date instanceof Date && !isNaN(date.valueOf());
  }

  isValidTime(arg: any): boolean {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timePattern.test(arg);
  }

  isNumber(arg: any) {
    return !isNaN(parseInt(arg)) && isFinite(arg);
  }
}
