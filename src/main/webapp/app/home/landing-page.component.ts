import { Component } from '@angular/core';

import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  constructor(private loginService: LoginService) {}

  login(): void {
    this.loginService.login();
  }
}
