import { Injectable, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private googleTokenCient!: google.accounts.oauth2.TokenClient;
  private token!: string;
  private isLoggedOn = signal(false);
  private rememberMe = signal(false);

  private readonly TOKEN_STORAGE_KEY = 'google_access_token';
  private readonly REMEMBER_ME_KEY = 'remember_me_enabled';
  private readonly TOKEN_EXPIRY_KEY = 'google_token_expiry';

  constructor(private router: Router) {
    gapi.load('client', async () => {
      await gapi.client.init({
        clientId: environment.GAPI_CLIENT_ID,
        apiKey: environment.GAPI_API_KEY,
        discoveryDocs: environment.GAPI_DISCOVERY_DOCS,
      });
    });

    this.googleTokenCient = google.accounts.oauth2.initTokenClient({
      client_id: environment.GAPI_CLIENT_ID,
      scope: environment.GAPI_SCOPE,
      callback: async (response) => this.googleOauthInitCallback(response),
    });

    // Check for stored token on initialization
    this.restoreStoredSession();
  }

  public setRememberMe(rememberMe: boolean) {
    this.rememberMe.set(rememberMe);
    localStorage.setItem(this.REMEMBER_ME_KEY, `${this.rememberMe}`);
  }

  public signIn() {
    if (gapi.client.getToken() === null) {
      this.googleTokenCient.requestAccessToken({ prompt: 'consent' });
    } else {
      this.googleTokenCient.requestAccessToken({ prompt: '' });
    }
  }

  public signOut() {
    google.accounts.oauth2.revoke(this.token, () => {
      gapi.client.setToken(null);
      this.token = '';
      this.isLoggedOn.set(false);
      this.rememberMe.set(false);

      // Clear stored credentials
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.REMEMBER_ME_KEY);
    });
  }

  public loginStateSignal = linkedSignal(() => this.isLoggedOn());

  public isRememberMeEnabled(): boolean {
    return this.rememberMe();
  }

  private isTokenExpired(): boolean {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    return !expiry || Date.now() > parseInt(expiry);
  }

  private restoreStoredSession(): void {
    const storedToken = localStorage.getItem(this.TOKEN_STORAGE_KEY);
    const rememberMeEnabled = localStorage.getItem(this.REMEMBER_ME_KEY);

    if (storedToken && rememberMeEnabled === 'true' && !this.isTokenExpired()) {
      this.token = storedToken;
      gapi.client.setToken({
        access_token: this.token,
      });
      this.isLoggedOn.set(true);
      this.rememberMe.set(true);
    } else {
      // Token expired or invalid - clear storage and require new login
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.REMEMBER_ME_KEY);
    }
  }

  private storeSessionIfRemembered(): void {
    if (this.rememberMe()) {
      localStorage.setItem(this.TOKEN_STORAGE_KEY, this.token);
      localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
      // Google access tokens expire in ~1 hour, store expiry time (59 min for safety)
      const expiryTime = Date.now() + 59 * 60 * 1000;
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    } else {
      console.log('rememberMe is false, not storing token');
    }
  }

  private googleOauthInitCallback(
    response: google.accounts.oauth2.TokenResponse
  ): void {
    this.token = response.access_token;
    if (this.token !== null && this.token !== '') {
      gapi.client.setToken({
        access_token: this.token,
      });
      console.log('token set');
      this.storeSessionIfRemembered();
    } else {
      console.log('token empty');
    }
    this.isLoggedOn.set(true);
    this.router.navigate(['/home']);
  }
}
