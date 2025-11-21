import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { NavBarComponent } from 'src/app/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root-page',
  templateUrl: './root-page.component.html',
  styleUrls: ['./root-page.component.scss'],
  imports: [NavBarComponent, RouterOutlet],
})
export class RootPageComponent {
  constructor() {}
}
