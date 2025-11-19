import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DriveService {
  private tableTitle: string = environment.TABLE_NAME;
  private storageKey = environment.TABLE_TITLE_STORAGE_KEY;

  public async getWorkingFile() {
    await gapi.client.drive.files
      .list({
        orderBy: 'name',
        fields: 'files(id, name)',
      })
      .then((response) => {
        if (!this.validateResponse(response)) {
          this.createSheet();
        }
      })
      .catch(() => console.log('shit happens'));
  }

  private validateResponse(
    response: gapi.client.Response<gapi.client.drive.FileList>
  ): boolean {
    let valid = false;
    const files = response.result.files;
    if (files?.length !== 0) {
      files?.forEach((file) => {
        if (this.isFileValid(file)) {
          localStorage.setItem(this.storageKey, file.id!);
          valid = true;
        }
      });
    }
    return valid;
  }

  private isFileValid(file: gapi.client.drive.File): boolean {
    if (file.name === undefined || file.id === undefined) return false;
    if (file.name === this.tableTitle) return true;
    return false;
  }

  private async createSheet() {
    await gapi.client.sheets.spreadsheets
      .create({
        resource: {
          properties: {
            title: this.tableTitle,
          },
          sheets: [
            {
              properties: {
                gridProperties: {
                  columnCount: 5,
                  frozenRowCount: 1,
                },
                title: 'sheet1',
              },
            },
          ],
        },
      })
      .then((response) => {
        const sheetId = response.result.spreadsheetId;
        if (sheetId !== undefined) {
          localStorage.setItem(this.storageKey, sheetId);
          this.addSheetHeaders(sheetId);
        }
      });
  }

  private addSheetHeaders(spredSheetId: string) {
    const _values = [['date', 'time', 'sys', 'dis', 'puls']];
    try {
      gapi.client.sheets.spreadsheets.values
        .append({
          valueInputOption: 'USER_ENTERED',
          spreadsheetId: spredSheetId,
          range: 'Sheet1!1:1',
          resource: {
            values: _values,
          },
        });
    } catch (err) {
      console.error(err);
    }
  }
}
