import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom, of } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { Account } from './account.model';
import { AccountService } from './account.service';

import { anonymousRouteAccess } from './anonymous-route-access.service';

describe('Anonymous Route Access Service', () => {
  let accountService: AccountService;

  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouter: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
      providers: [
        AccountService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;

    accountService = TestBed.inject(AccountService);
  });

  test('can activate if account is present', async () => {
    jest.spyOn(accountService, 'identity').mockReturnValueOnce(of({} as Account));

    const canActivate = await firstValueFrom(
      // @ts-ignore: skip conversion for testing
      TestBed.runInInjectionContext(() => anonymousRouteAccess(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot)),
    );

    expect(canActivate).toBeFalsy();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('home');
  });

  test('cannot activate if account is present', async () => {
    jest.spyOn(accountService, 'identity').mockReturnValueOnce(of(null));

    const canActivate = await firstValueFrom(
      // @ts-ignore: skip conversion for testing
      TestBed.runInInjectionContext(() => anonymousRouteAccess(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot)),
    );

    expect(canActivate).toBeTruthy();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });
});
