import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { EMPTY, firstValueFrom, of } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { NgxWebstorageModule } from 'ngx-webstorage';

import { Account } from './account.model';
import { AccountService } from './account.service';

import { AnonymousRouteAccessService } from './anonymous-route-access.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Anonymous Route Access Service', () => {
  let accountService: AccountService;

  let service: AnonymousRouteAccessService;

  let mockNavigateByUrl: jest.Mock;

  beforeEach(() => {
    mockNavigateByUrl = jest.fn().mockReturnValueOnce(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        AccountService,
        {
          provide: Router,
          useValue: {
            navigateByUrl: mockNavigateByUrl,
          },
        },
      ],
    });

    accountService = TestBed.inject(AccountService);

    service = TestBed.inject(AnonymousRouteAccessService);
  });

  test('can activate if account is present', async () => {
    jest.spyOn(accountService, 'identity').mockReturnValueOnce(of({} as Account));

    const canActivate = await firstValueFrom(service.canActivate());

    expect(canActivate).toBeFalsy();
    expect(mockNavigateByUrl).toHaveBeenCalledWith('home');
  });

  test('cannot activate if account is present', async () => {
    jest.spyOn(accountService, 'identity').mockReturnValueOnce(of(null));

    const canActivate = await firstValueFrom(service.canActivate());

    expect(canActivate).toBeTruthy();
    expect(mockNavigateByUrl).not.toHaveBeenCalled();
  });
});
