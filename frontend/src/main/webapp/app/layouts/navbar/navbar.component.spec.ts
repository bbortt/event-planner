jest.mock('@angular/router');
jest.mock('ngx-webstorage');
jest.mock('@ngx-translate/core');
jest.mock('app/core/auth/account.service');
jest.mock('app/login/login.service');

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { of } from 'rxjs';

import { SessionStorageService } from 'ngx-webstorage';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';

import { Account } from '../../core/auth/account.model';

import { NavbarComponent } from './navbar.component';

describe('Component Tests', () => {
  describe('Navbar Component', () => {
    let comp: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let mockAccountService: AccountService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          declarations: [NavbarComponent],
          providers: [AccountService, SessionStorageService, TranslateService, Router, LoginService],
        })
          .overrideTemplate(NavbarComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(NavbarComponent);
      comp = fixture.componentInstance;
      mockAccountService = TestBed.inject(AccountService);
    });

    it('Should call accountService.identity on init', () => {
      // GIVEN
      jest.spyOn(mockAccountService, 'identity').mockReturnValueOnce(of({} as Account));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(mockAccountService.identity).toHaveBeenCalled();
    });

    it('Should call accountService.isAuthenticated on authentication', () => {
      // WHEN
      comp.isAuthenticated();

      // THEN
      expect(mockAccountService.isAuthenticated).toHaveBeenCalled();
    });
  });
});
