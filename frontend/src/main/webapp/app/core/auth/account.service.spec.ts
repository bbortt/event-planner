jest.mock('@angular/router');
jest.mock('@ngx-translate/core');
jest.mock('app/core/auth/state-storage.service');

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { NgxWebstorageModule, SessionStorageService } from 'ngx-webstorage';

import { Account } from 'app/core/auth/account.model';
import { Authority } from 'app/config/authority.constants';

import { AccountService } from './account.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ProjectService } from '../../entities/project/project.service';

function accountWithAuthorities(authorities: string[]): Account {
  return {
    activated: true,
    authorities,
    email: '',
    firstName: '',
    langKey: '',
    lastName: '',
    login: '',
    imageUrl: '',
    rolePerProject: new Map(),
  };
}

describe('Service Tests', () => {
  describe('Account Service', () => {
    let service: AccountService;
    let applicationConfigService: ApplicationConfigService;
    let httpMock: HttpTestingController;
    let mockStorageService: StateStorageService;
    let mockRouter: Router;
    let mockTranslateService: TranslateService;
    let sessionStorageService: SessionStorageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
        providers: [TranslateService, StateStorageService, Router, ProjectService],
      });

      service = TestBed.inject(AccountService);
      applicationConfigService = TestBed.inject(ApplicationConfigService);
      httpMock = TestBed.inject(HttpTestingController);
      mockStorageService = TestBed.inject(StateStorageService);
      mockRouter = TestBed.inject(Router);
      mockTranslateService = TestBed.inject(TranslateService);
      sessionStorageService = TestBed.inject(SessionStorageService);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('authenticate', () => {
      it('authenticationState should emit null if input is null', () => {
        // GIVEN
        let userIdentity: Account | null = accountWithAuthorities([]);
        service.getAuthenticationState().subscribe(account => (userIdentity = account));

        // WHEN
        service.authenticate(null);

        // THEN
        expect(userIdentity).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
      });

      it('authenticationState should emit the same account as was in input parameter', () => {
        // GIVEN
        const expectedResult = accountWithAuthorities([]);
        let userIdentity: Account | null = null;
        service.getAuthenticationState().subscribe(account => (userIdentity = account));

        // WHEN
        service.authenticate(expectedResult);

        // THEN
        expect(userIdentity).toEqual(expectedResult);
        expect(service.isAuthenticated()).toBe(true);
      });
    });

    describe('identity', () => {
      it('should call /account only once if not logged out after first authentication and should call /account again if user has logged out', () => {
        // Given the user is authenticated
        service.identity().subscribe();
        httpMock.expectOne({ method: 'GET', url: 'api/account' }).flush({});
        httpMock.expectOne({ method: 'GET', url: 'api/projects/rolePerProject' }).flush({});

        // When I call
        service.identity().subscribe();

        // Then there is no second request
        httpMock.expectNone({ method: 'GET' });

        // When I log out
        service.authenticate(null);
        // and then call
        service.identity().subscribe();

        // Then there is a new request
        httpMock.expectOne({ method: 'GET', url: 'api/account' }).flush({});
        httpMock.expectOne({ method: 'GET', url: 'api/projects/rolePerProject' }).flush({});
      });

      describe('should change the language on authentication if necessary', () => {
        it('should change language if user has not changed language manually', () => {
          // GIVEN
          sessionStorageService.retrieve = jest.fn(key => (key === 'locale' ? undefined : 'otherSessionStorageValue'));

          // WHEN
          service.identity().subscribe();
          httpMock.expectOne({ method: 'GET', url: 'api/account' }).flush({ ...accountWithAuthorities([]), langKey: 'accountLang' });
          httpMock.expectOne({ method: 'GET', url: 'api/projects/rolePerProject' }).flush({});

          // THEN
          expect(mockTranslateService.use).toHaveBeenCalledWith('accountLang');
        });

        it('should not change language if user has changed language manually', () => {
          // GIVEN
          sessionStorageService.retrieve = jest.fn(key => (key === 'locale' ? 'sessionLang' : undefined));

          // WHEN
          service.identity().subscribe();
          httpMock.expectOne({ method: 'GET', url: 'api/account' }).flush({});
          httpMock.expectOne({ method: 'GET', url: 'api/projects/rolePerProject' }).flush({});

          // THEN
          expect(mockTranslateService.use).not.toHaveBeenCalled();
        });
      });

      describe('navigateToStoredUrl', () => {
        it('should navigate to the previous stored url post successful authentication', () => {
          // GIVEN
          mockStorageService.getUrl = jest.fn(() => 'admin/users?page=0');

          // WHEN
          service.identity().subscribe();
          httpMock.expectOne({ method: 'GET', url: 'api/account' }).flush({});
          httpMock.expectOne({ method: 'GET', url: 'api/projects/rolePerProject' }).flush({});

          // THEN
          expect(mockStorageService.getUrl).toHaveBeenCalledTimes(1);
          expect(mockStorageService.clearUrl).toHaveBeenCalledTimes(1);
          expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('admin/users?page=0');
        });

        it('should not navigate to the previous stored url when authentication fails', () => {
          // WHEN
          service.identity().subscribe();
          httpMock.expectOne({ method: 'GET', url: 'api/account' }).error(new ErrorEvent(''));
          const rolePerProjectRequest = httpMock.expectOne({ method: 'GET', url: 'api/projects/rolePerProject' });

          // THEN
          expect(mockStorageService.getUrl).not.toHaveBeenCalled();
          expect(mockStorageService.clearUrl).not.toHaveBeenCalled();
          expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();

          // AND
          expect(rolePerProjectRequest.cancelled).toBeTruthy();
        });

        it('should not navigate to the previous stored url when no such url exists post successful authentication', () => {
          // GIVEN
          mockStorageService.getUrl = jest.fn(() => null);

          // WHEN
          service.identity().subscribe();
          httpMock.expectOne({ method: 'GET', url: 'api/account' }).flush({});
          httpMock.expectOne({ method: 'GET', url: 'api/projects/rolePerProject' }).flush({});

          // THEN
          expect(mockStorageService.getUrl).toHaveBeenCalledTimes(1);
          expect(mockStorageService.clearUrl).not.toHaveBeenCalled();
          expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
        });

        it('should navigate to the previous stored url even when getting roles failes', () => {
          // WHEN
          service.identity().subscribe();
          httpMock.expectOne({ method: 'GET', url: 'api/account' }).flush({});
          httpMock.expectOne({ method: 'GET', url: 'api/projects/rolePerProject' }).error(new ErrorEvent(''));

          // THEN
          expect(mockStorageService.getUrl).toHaveBeenCalled();
          expect(mockStorageService.clearUrl).not.toHaveBeenCalled();
          expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
        });
      });
    });

    describe('hasAnyAuthority', () => {
      describe('hasAnyAuthority string parameter', () => {
        it('should return false if user is not logged', () => {
          const hasAuthority = service.hasAnyAuthority(Authority.USER);
          expect(hasAuthority).toBe(false);
        });

        it('should return false if user is logged and has not authority', () => {
          service.authenticate(accountWithAuthorities([Authority.USER]));

          const hasAuthority = service.hasAnyAuthority(Authority.ADMIN);

          expect(hasAuthority).toBe(false);
        });

        it('should return true if user is logged and has authority', () => {
          service.authenticate(accountWithAuthorities([Authority.USER]));

          const hasAuthority = service.hasAnyAuthority(Authority.USER);

          expect(hasAuthority).toBe(true);
        });
      });

      describe('hasAnyAuthority array parameter', () => {
        it('should return false if user is not logged', () => {
          const hasAuthority = service.hasAnyAuthority([Authority.USER]);
          expect(hasAuthority).toBeFalsy();
        });

        it('should return false if user is logged and has not authority', () => {
          service.authenticate(accountWithAuthorities([Authority.USER]));

          const hasAuthority = service.hasAnyAuthority([Authority.ADMIN]);

          expect(hasAuthority).toBe(false);
        });

        it('should return true if user is logged and has authority', () => {
          service.authenticate(accountWithAuthorities([Authority.USER]));

          const hasAuthority = service.hasAnyAuthority([Authority.USER, Authority.ADMIN]);

          expect(hasAuthority).toBe(true);
        });
      });
    });
  });
});
