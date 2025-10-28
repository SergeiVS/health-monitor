import { Component, OnInit, signal} from '@angular/core';
import { BloodPresureInputForm } from '../../components/indicators-input/idicators-input.component';
import { GoogleAuthService } from 'src/app/service/google-service/google-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports:[BloodPresureInputForm],
})
export class HomeComponent  implements OnInit {

  constructor(private service: GoogleAuthService) { }

  ngOnInit() {}

  title = signal(`Home page`)

}
