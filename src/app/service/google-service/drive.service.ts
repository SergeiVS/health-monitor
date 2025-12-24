import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SheetStateService } from '../sheet-state.service';
@Injectable({
  providedIn: 'root',
})
export class DriveService {
  private sheetStateService = inject(SheetStateService);

  private spredsheetTitle: string = environment.FILE_NAME;
  private sheetName = environment.SHEET_NAME;

  constructor() {}

  public async getWorkingFile() {
    try {
      const response = await gapi.client.drive.files.list({
        orderBy: 'name',
        fields: 'files(id, name)',
      });

      this.setOrCreateWorkingFile(response);
    } catch (error) {
      console.error('Error fetching file list from Google Drive', error);
    }
  }

  private setOrCreateWorkingFile(
    response: gapi.client.Response<gapi.client.drive.FileList>
  ) {
    const file = this.extractFileFromResponse(response);
    if (file === undefined) {
      this.createNewSpredsheet();
    } else {
      this.setFileSheetsIds(file);
    }
  }

  private async setFileSheetsIds(file: gapi.client.drive.File): Promise<void> {
    const spredsheetId = file.id!;
    if (!spredsheetId) {
      throw new Error('Spreadsheet ID is undefined');
    }

    const sheets = await this.getAllFileSheets(spredsheetId);

    const sheet = sheets?.find((s) => s.properties?.title === this.sheetName);
    const sheetId = sheet?.properties?.sheetId?.toString();

    this.sheetStateService.setSpredsheetId(spredsheetId);
    this.sheetStateService.setSheetId(sheetId!);
  }

  private async getAllFileSheets(spredsheetId: string) {
    return await gapi.client.sheets.spreadsheets
      .get({
        spreadsheetId: spredsheetId,
      })
      .then((response) => response.result.sheets as any[] | undefined);
  }

  private extractFileFromResponse(
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

  private async createNewSpredsheet() {
    try {
      const response = await gapi.client.sheets.spreadsheets.create({
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
      });

      this.setNewSheetProperties(response);
    } catch (error) {
      console.error('Error creating new Google Sheet', error);
    }
  }

  // Setting the new spreadsheet and sheet IDs in the SheetStateService
  private setNewSheetProperties(
    response: gapi.client.Response<gapi.client.sheets.Spreadsheet>
  ) {
    const spredsheetId = response.result.spreadsheetId;
    const sheets = response.result.sheets as any[] | undefined;
    const sheet = sheets?.find((s) => s.properties?.title === this.sheetName);
    const sheetId = sheet?.properties?.sheetId;

    if (spredsheetId !== undefined) {
      this.sheetStateService.setSpredsheetId(spredsheetId);
      this.addSheetHeaders(spredsheetId);
    }

    if (sheetId !== undefined) {
      this.sheetStateService.setSheetId(sheetId.toString());
    }
  }

  // Adding headers to the newly created sheet
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
      console.error('Error by adding sheet headers:', err);
    }
  }
}
