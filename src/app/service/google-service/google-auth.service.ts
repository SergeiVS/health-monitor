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
        this.isLoggedOn.set(true);
        this.router.navigate(['/home'])
      },
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
}
