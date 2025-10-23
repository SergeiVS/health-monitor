import { Component, OnInit, signal } from '@angular/core';
import { BloodPresureInputForm } from '../../components/indicators-input/idicators-input.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports:[BloodPresureInputForm]
})
export class HomeComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  title = signal(`Home page`)

}
