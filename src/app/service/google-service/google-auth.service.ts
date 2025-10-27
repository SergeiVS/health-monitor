import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private googleTokenCient!: google.accounts.oauth2.TokenClient;
  private token!: string;

  constructor() {
    gapi.load('client', () => {
      gapi.client.init({
        clientId: environment.GAPI_CLIENT_ID,
        apiKey: environment.GAPI_API_KEY,
        discoveryDocs: environment.GAPI_DISCOVERY_DOCS,
      });
    });

    this.googleTokenCient = google.accounts.oauth2.initTokenClient({
      client_id: environment.GAPI_CLIENT_ID,
      scope: environment.GAPI_SCOPE,
      callback: (response) => {
        this.token = response.access_token;
        gapi.client.setToken({
          access_token: this.token,
        });
      },
    });
  }

  public signIn() {
    if (gapi.client.getToken() === null) {
      this.googleTokenCient.requestAccessToken({ prompt: 'consent' });
    } else {
      this.googleTokenCient.requestAccessToken({ prompt: 'consent' });
    }
  }

  public signOut() {
    google.accounts.oauth2.revoke(this.token, () => {
      gapi.client.setToken(null);
      this.token = '';
    });
  }
}
