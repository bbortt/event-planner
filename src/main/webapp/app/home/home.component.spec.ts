jest.mock('app/core/auth/account.service');
jest.mock('app/login/login.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of, Subject } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { LoginService } from 'app/login/login.service';

import HomeComponent from './home.component';

const account: Account = {
  activated: true,
  authorities: [],
  email: '',
  firstName: null,
  langKey: '',
  lastName: null,
  login: 'login',
  imageUrl: null,
};

describe('Landing Page Component', () => {
  let mockAccountService: AccountService;
  let mockRouter: Router;

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [AccountService, LoginService],
    })
      .overrideTemplate(HomeComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));
    mockAccountService.getAuthenticationState = jest.fn(() => of(null));

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should synchronize account variable with current account', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.account).toBeNull();

      // WHEN
      authenticationState.next(account);

      // THEN
      expect(component.account).toEqual(account);

      // WHEN
      authenticationState.next(null);

      // THEN
      expect(component.account).toBeNull();
    });
  });

  describe('ngOnDestroy', () => {
    it('Should destroy authentication state subscription on component destroy', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.account).toBeNull();

      // WHEN
      authenticationState.next(account);

      // THEN
      expect(component.account).toEqual(account);

      // WHEN
      component.ngOnDestroy();
      authenticationState.next(null);

      // THEN
      expect(component.account).toEqual(account);
    });
  });

  describe('login', () => {
    it('Should navigate to /login on login', () => {
      // WHEN
      component.login();

      // THEN
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
