import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SheetStateService } from '../sheet-state.service';
@Injectable({
  providedIn: 'root',
})
export class DriveService {
  private spredsheetTitle: string = environment.FILE_NAME;
  private sheetName = environment.SHEET_NAME;

  constructor(private sheetStateService: SheetStateService) {}

  public async getWorkingFile() {
    await gapi.client.drive.files
      .list({
        orderBy: 'name',
        fields: 'files(id, name)',
      })
      .then((response) => {
        const file = this.getFile(response);
        if (file === undefined) {
          this.createSheet();
        } else {
          this.setFileSheetsId(file);
        }
      })
      .catch(() => console.error('Error fetching file list from Google Drive'));
  }

  private async setFileSheetsId(file: gapi.client.drive.File): Promise<void> {
    const spredsheetId = file.id!;
    if (!spredsheetId) {
      throw new Error('Spreadsheet ID is undefined');
    }
    const sheets = await gapi.client.sheets.spreadsheets
      .get({
        spreadsheetId: spredsheetId,
      })
      .then((response) => response.result.sheets as any[] | undefined);
    const sheet = sheets?.find((s) => s.properties?.title === this.sheetName);
    const sheetId = sheet?.properties?.sheetId?.toString();

    this.sheetStateService.setSpredsheetId(spredsheetId);
    this.sheetStateService.setSheetId(sheetId!);
  }

  private getFile(
    response: gapi.client.Response<gapi.client.drive.FileList>
  ): gapi.client.drive.File | undefined {
    const files = response.result.files;
    let _file: gapi.client.drive.File | undefined = undefined;

    if (files?.length !== 0) {
      files?.forEach((file) => {
        if (this.isFileValid(file)) {
          _file = file;
        }
      });
    }
    return _file;
  }

  private isFileValid(file: gapi.client.drive.File): boolean {
    let isValid = false;
    if (file.name === this.spredsheetTitle) isValid = true;
    return isValid;
  }

  private async createSheet() {
    await gapi.client.sheets.spreadsheets
      .create({
        resource: {
          properties: {
            title: this.spredsheetTitle,
          },
          sheets: [
            {
              properties: {
                gridProperties: {
                  columnCount: 5,
                  frozenRowCount: 1,
                },
                title: this.sheetName,
              },
            },
          ],
        },
      })
      .then((response) => {
        console.log('New Google Sheet created successfully.');
        const spredsheetId = response.result.spreadsheetId;

        const sheets = response.result.sheets as any[] | undefined;
        const sheet = sheets?.find(
          (s) => s.properties?.title === this.sheetName
        );

        const sheetId = sheet?.properties?.sheetId;

        if (spredsheetId !== undefined) {
          this.sheetStateService.setSpredsheetId(spredsheetId);
          this.addSheetHeaders(spredsheetId);
        }

        if (sheetId !== undefined) {
          this.sheetStateService.setSheetId(sheetId.toString());
        }
      })
      .catch(() => console.error('Error creating new Google Sheet'));
  }

  private async addSheetHeaders(spredSheetId: string) {
    const _values = [['date', 'time', 'sys', 'dis', 'puls']];
    try {
      await gapi.client.sheets.spreadsheets.values.append({
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
