import { Component } from '@angular/core';

import { LoginService } from 'app/login/login.service';

import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [SharedModule],
})
export default class LandingPageComponent {
  constructor(private loginService: LoginService) {}

  login(): void {
    this.loginService.login();
  }
}
