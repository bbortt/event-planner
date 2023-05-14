import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom, of } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { NgxWebstorageModule } from 'ngx-webstorage';

import { Account } from './account.model';
import { AccountService } from './account.service';

import { anonymousRouteAccess } from './anonymous-route-access';

const FUNCTION_NAME = 'anonymousRouteAccess';

describe('Anonymous Route Access', () => {
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  let accountService: AccountService;

  let mockNavigateByUrl: jest.Mock;

  beforeEach(() => {
    mockNavigateByUrl = jest.fn().mockReturnValueOnce(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot(), RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
      providers: [
        AccountService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: mockNavigateByUrl,
            routerState: {
              snapshot: {},
            },
          },
        },
        {
          provide: FUNCTION_NAME,
          useFactory: anonymousRouteAccess,
        },
      ],
    });

    route = TestBed.inject(ActivatedRoute).snapshot;
    state = TestBed.inject(Router).routerState.snapshot;

    accountService = TestBed.inject(AccountService);
  });

  test('can activate if account is present', async () => {
    jest.spyOn(accountService, 'identity').mockReturnValueOnce(of({} as Account));

    // @ts-ignore skip conversion for testing
    const canActivate = await firstValueFrom(TestBed.inject(FUNCTION_NAME));

    expect(canActivate).toBeFalsy();
    expect(mockNavigateByUrl).toHaveBeenCalledWith('home');
  });

  test('cannot activate if account is present', async () => {
    jest.spyOn(accountService, 'identity').mockReturnValueOnce(of(null));

    // @ts-ignore skip conversion for testing
    const canActivate = await firstValueFrom(TestBed.inject(FUNCTION_NAME));

    expect(canActivate).toBeTruthy();
    expect(mockNavigateByUrl).not.toHaveBeenCalled();
  });
});
