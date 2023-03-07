jest.mock('app/core/auth/account.service');
jest.mock('app/login/login.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';

import { LandingPageComponent } from './landing-page.component';

describe('Landing Page Component', () => {
  let comp: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let mockAccountService: AccountService;
  let mockLoginService: LoginService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
      providers: [AccountService, LoginService],
    })
      .overrideTemplate(LandingPageComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    comp = fixture.componentInstance;
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));
    mockAccountService.getAuthenticationState = jest.fn(() => of(null));
    mockLoginService = TestBed.inject(LoginService);
  });

  describe('login', () => {
    it('Should call loginService.login on login', () => {
      // WHEN
      comp.login();

      // THEN
      expect(mockLoginService.login).toHaveBeenCalled();
    });
  });
});
