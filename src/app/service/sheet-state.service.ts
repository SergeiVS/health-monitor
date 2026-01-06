import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SheetStateService {
  private sheetId = signal<string>('');
  private spreadsheetId = signal<string>('');

  constructor() {
    this.loadSheetIdFromStorage();
    this.loadSpreadsheetIdFromStorage();
  }

  public getSheetId(): string {
    return this.sheetId();
  }

  public getSpreadsheetId(): string {
    return this.spreadsheetId();
  }

  public setSheetId(sheetId: string) {
    this.sheetId.set(sheetId);
    localStorage.setItem(environment.SHEET_ID_STORAGE_KEY, sheetId);
  }

  public clearSheetId() {
    this.sheetId.set('');
    localStorage.removeItem(environment.SHEET_ID_STORAGE_KEY);
  }

  public setSpredsheetId(spredsheetId: string) {
    this.spreadsheetId.set(spredsheetId);
    localStorage.setItem(environment.SPREADSHEET_ID_STORAGE_KEY, spredsheetId);
  }

  public clearSpredsheetId() {
    this.spreadsheetId.set('');
    localStorage.removeItem(environment.SPREADSHEET_ID_STORAGE_KEY);
  }

  private loadSpreadsheetIdFromStorage() {
    const storedId = localStorage.getItem(
      environment.SPREADSHEET_ID_STORAGE_KEY
    );
    if (storedId) {
      this.spreadsheetId.set(storedId);
    }
  }

  private loadSheetIdFromStorage() {
    const storedId = localStorage.getItem(environment.SHEET_ID_STORAGE_KEY);
    if (storedId) {
      this.sheetId.set(storedId);
    }
  }
}
