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

  constructor(private router: Router) {
    gapi.load('client', async () => {
      await gapi.client
        .init({
          clientId: environment.GAPI_CLIENT_ID,
          apiKey: environment.GAPI_API_KEY,
          discoveryDocs: environment.GAPI_DISCOVERY_DOCS,
        })
    });

    this.googleTokenCient = google.accounts.oauth2.initTokenClient({
      client_id: environment.GAPI_CLIENT_ID,
      scope: environment.GAPI_SCOPE,
      callback: async (response) => this.googleOauthInitCallback(response),
    });
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
    });
  }

  public loginStateSignal = linkedSignal(() => this.isLoggedOn());

  private async googleOauthInitCallback(
    response: google.accounts.oauth2.TokenResponse
  ): Promise<void> {
    this.token = response.access_token;
    if (this.token !== null && this.token !== '') {
      gapi.client.setToken({
        access_token: this.token,
      });
      console.log('token set');
    } else {
      console.log('token empty');
    }
    this.isLoggedOn.set(true);
    this.router.navigate(['/home']);
  }
}
