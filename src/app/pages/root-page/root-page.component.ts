import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavBarComponent } from "src/app/components/nav-bar/nav-bar.component";
// import { GoogleSigninService } from 'src/app/service/auth/google-signin.service';
// import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root-page',
  templateUrl: './root-page.component.html',
  styleUrls: ['./root-page.component.scss'],
  imports: [RouterOutlet, NavBarComponent
    // , MatButtonModule
  ],
})
export class RootPageComponent  implements OnInit {

 user!: gapi.auth2.GoogleUser | null;

  constructor(
    // private signInService: GoogleSigninService,
    // private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.signInService.observanle().subscribe((user) => {
    //   this.user = user;
    //   this.ref.detectChanges()
    // });
  }

  // signIn(){
  //   this.signInService.signIn()
  // }

  // signOut(){
  //   this.signInService.signOut()
  // }

}
