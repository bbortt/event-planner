jest.mock('app/core/auth/account.service');
jest.mock('app/login/login.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';

import LandingPageComponent from './landing-page.component';

describe('Landing Page Component', () => {
  let mockAccountService: AccountService;
  let mockLoginService: LoginService;

  let fixture: ComponentFixture<LandingPageComponent>;
  let component: LandingPageComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [AccountService, LoginService],
    })
      .overrideTemplate(LandingPageComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));
    mockAccountService.getAuthenticationState = jest.fn(() => of(null));
    mockLoginService = TestBed.inject(LoginService);

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
  });

  describe('login', () => {
    it('Should call loginService.login on login', () => {
      // WHEN
      component.login();

      // THEN
      expect(mockLoginService.login).toHaveBeenCalled();
    });
  });
});
