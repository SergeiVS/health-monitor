import { Injectable, linkedSignal, signal } from '@angular/core';
import { FormValues } from 'src/app/models/form-values-model';
import { TimeRange } from 'src/app/models/time-range-model';
import { environment } from 'src/environments/environment';
import { SheetStateService } from '../sheet-state.service';

@Injectable({
  providedIn: 'root',
})
export class DataFilterService {
  private _filteredData = signal<FormValues[]>([]);
  readonly filteredData = this._filteredData.asReadonly();

  private sheetName = environment.SHEET_NAME;
  private spredsheetId=linkedSignal(() => this.sheetStateService.getSpredsheetId());

  constructor(private sheetStateService: SheetStateService) {}

  public async loadDataOnRequest(timeRange: TimeRange): Promise<void> {
    await gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: this.spredsheetId(),
        range: `${this.sheetName}!A2:E`,
      })
      .then((response) => {
        const rows = response.result.values;
        const allData = this.parseRows(rows || []);
        const filteredData = this.filterDataByTimeRange(allData, timeRange);
        this._filteredData.set(filteredData);
      });
  }

  private filterDataByTimeRange(
    data: FormValues[],
    timeRange: TimeRange
  ): FormValues[] {
    const fromDate = new Date(timeRange.from).getTime();
    const toDate = new Date(timeRange.to).getTime();

    return data.filter((entry) => {
      const entryDate = new Date(entry.date).getTime();
      return entryDate >= fromDate && entryDate <= toDate;
    });
  }

  private parseRows(rows: any[][]): FormValues[] {
    if (rows && rows.length > 0) {
      return rows.map((row) => {
        if (!this.isRowValid(row)) {
          throw new Error(`Invalid data row: ${row}`);
        }
        return {
          date: row[0],
          time: row[1],
          sys: Number(row[2]),
          dis: Number(row[3]),
          puls: row[4] !== undefined ? Number(row[4]) : undefined,
        };
      });
    } else {
      return [];
    }
  }

  private isRowValid(row: any[]): boolean {
    return (
      this.validateDate(row[0]) &&
      this.validateTime(row[1]) &&
      this.validateNumber(row[2].toString()) &&
      this.validateNumber(row[3].toString()) &&
      (row[4] === undefined || this.validateNumber(row[4].toString()))
    );
  }
  private validateDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateRegex.test(dateString);
  }

  private validateTime(timeString: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(timeString);
  }

  private validateNumber(value: string): boolean {
    return !isNaN(Number(value));
  }
}
