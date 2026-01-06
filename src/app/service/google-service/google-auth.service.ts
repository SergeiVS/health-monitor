import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SheetStateService } from '../sheet-state.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private router = inject(Router);
  private sheetStateService = inject(SheetStateService);

  private googleTokenClient!: google.accounts.oauth2.TokenClient;
  private token: string = '';
  private isLoggedOn = signal(false);
  private rememberMe = signal(false);

  private readonly token_storage_key = environment.ACCESS_TOKEN_KEY;
  private readonly remember_me_key = environment.REMEMBER_ME_KEY;
  private readonly token_expire_key = environment.TOKEN_EXPIRE_KEY;

  constructor() {
    this.initGoogleClient().then();
    this.loadTokenClient();
    // Check for stored token on initialization
    this.restoreStoredSession();
  }

  private async initGoogleClient() {
    gapi.load('client', async () => {
      await gapi.client.init({
        clientId: environment.GAPI_CLIENT_ID,
        apiKey: environment.GAPI_API_KEY,
        discoveryDocs: environment.GAPI_DISCOVERY_DOCS,
      });
    });
  }

  private loadTokenClient() {
    this.googleTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: environment.GAPI_CLIENT_ID,
      scope: environment.GAPI_SCOPE,
      callback: (response) => this.googleOauthInitCallback(response),
    });
  }

  private googleOauthInitCallback(
    response: google.accounts.oauth2.TokenResponse
  ): void {
    gapi.client.setToken(null);
    this.token = response.access_token;
    if (this.token !== null && this.token !== '') {
      gapi.client.setToken({
        access_token: this.token,
      });
      this.storeSessionIfRemembered();
    } else {
      console.log('token empty');
    }
    this.isLoggedOn.set(true);
    this.router.navigate(['/home']);
  }

  public signIn() {
    if (gapi.client.getToken() === null) {
      this.googleTokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      this.googleTokenClient.requestAccessToken({ prompt: '' });
    }
  }

  public signOut() {
    google.accounts.oauth2.revoke(this.token, () => {
      gapi.client.setToken(null);
      this.token = '';
      this.isLoggedOn.set(false);
      this.rememberMe.set(false);

      // Clear stored credentials
      localStorage.removeItem(this.token_storage_key);
      localStorage.removeItem(this.token_expire_key);
      localStorage.removeItem(this.remember_me_key);
      this.sheetStateService.clearSpredsheetId();
      this.sheetStateService.clearSheetId();
      this.router.navigate(['/login']);
    });
  }

  public setRememberMe(rememberMe: boolean) {
    this.rememberMe.set(rememberMe);
    localStorage.setItem(this.remember_me_key, `${this.rememberMe}`);
  }

  public loginStateSignal = linkedSignal(() => this.isLoggedOn());

  public isRememberMeEnabled(): boolean {
    return this.rememberMe();
  }

  private isTokenExpired(): boolean {
    const expiry = localStorage.getItem(this.token_expire_key);
    return !expiry || Date.now() > parseInt(expiry);
  }

  private restoreStoredSession(): void {
    const storedToken = localStorage.getItem(this.token_storage_key);
    const rememberMeEnabled = localStorage.getItem(this.remember_me_key);

    if (storedToken && rememberMeEnabled === 'true' && !this.isTokenExpired()) {
      this.token = storedToken;
      gapi.client.setToken({
        access_token: this.token,
      });
      this.isLoggedOn.set(true);
      this.rememberMe.set(true);
    } else {
      // Token expired or invalid - clear storage and require new login
      localStorage.removeItem(this.token_storage_key);
      localStorage.removeItem(this.token_expire_key);
      localStorage.removeItem(this.remember_me_key);
    }
  }

  private storeSessionIfRemembered(): void {
    if (this.rememberMe()) {
      localStorage.setItem(this.token_storage_key, this.token);
      localStorage.setItem(this.remember_me_key, 'true');
      // Google access tokens expire in ~1 hour, store expiry time (59 min for safety)
      const expiryTime = Date.now() + 59 * 60 * 1000;
      localStorage.setItem(this.token_expire_key, expiryTime.toString());
    } else {
      console.error('rememberMe is false, not storing token');
    }
  }
}
