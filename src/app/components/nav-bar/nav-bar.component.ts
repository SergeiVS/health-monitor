import { Component } from '@angular/core';
import {RouterModule} from "@angular/router";
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../menu/menu.component";


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [RouterModule, CommonModule, MenuComponent],
})
export class NavBarComponent {


}
