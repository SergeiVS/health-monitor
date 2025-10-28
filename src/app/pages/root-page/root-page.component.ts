import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from 'src/app/components/nav-bar/nav-bar.component';
import { GoogleAuthService } from 'src/app/service/google-service/google-auth.service';

@Component({
  selector: 'app-root-page',
  templateUrl: './root-page.component.html',
  styleUrls: ['./root-page.component.scss'],
  imports: [NavBarComponent, RouterOutlet],
})
export class RootPageComponent {
  constructor() {}
}
