import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { firstValueFrom, of } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { NgxWebstorageModule } from 'ngx-webstorage';

import { Account } from './account.model';
import { AccountService } from './account.service';

import { AnonymousRouteAccessService } from './anonymous-route-access.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Anonymous Route Access Service', () => {
  let accountService: AccountService;

  let service: AnonymousRouteAccessService;

  const mockNavigate = jest.fn();

  class MockRouter {
    navigate = mockNavigate;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        AccountService,
        {
          provide: Router,
          useClass: MockRouter,
        },
      ],
    });

    accountService = TestBed.inject(AccountService);

    service = TestBed.inject(AnonymousRouteAccessService);
  });

  beforeEach(() => {
    mockNavigate.mockReset();
  });

  test('can activate if account is present', async () => {
    jest.spyOn(accountService, 'identity').mockReturnValueOnce(of({} as Account));

    const canActivate = await firstValueFrom(service.canActivate());

    expect(canActivate).toBeFalsy();
    expect(mockNavigate).toHaveBeenCalledWith(['home']);
  });

  test('cannot activate if account is present', async () => {
    jest.spyOn(accountService, 'identity').mockReturnValueOnce(of(null));

    const canActivate = await firstValueFrom(service.canActivate());

    expect(canActivate).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
