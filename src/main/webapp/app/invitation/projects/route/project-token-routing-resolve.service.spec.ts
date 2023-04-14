import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MissingTranslationHandler, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxWebstorageModule, SessionStorageService } from 'ngx-webstorage';

import { Project, ProjectService as ApiProjectService } from 'app/api';
import { missingTranslationHandler } from 'app/config/translation.config';

import { ProjectTokenRoutingResolveService } from './project-token-routing-resolve.service';
import { firstValueFrom, of } from 'rxjs';
import { AccountService } from '../../../core/auth/account.service';

describe('Project token routing resolve service', () => {
  let accountService: AccountService;
  let apiProjectService: ApiProjectService;
  let mockRouter: Router;

  let mockTranslateService: TranslateService;
  let sessionStorageService: SessionStorageService;

  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;

  let fixture: ProjectTokenRoutingResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgxWebstorageModule.forRoot()],
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

    accountService = TestBed.inject(AccountService);

    apiProjectService = TestBed.inject(ApiProjectService);
    apiProjectService.findProjectByToken = jest.fn();

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));

    mockTranslateService = TestBed.inject(TranslateService);
    jest.spyOn(mockTranslateService, 'use').mockImplementation(() => of(''));
    sessionStorageService = TestBed.inject(SessionStorageService);

    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    mockActivatedRouteSnapshot.params = { token: '0c4b3e09-525a-45e5-afe4-4557838aa361' };

    fixture = TestBed.inject(ProjectTokenRoutingResolveService);
  });

  describe('resolve', () => {
    it('should return null if token is not provided', async () => {
      mockActivatedRouteSnapshot.params = {};
      const accountServiceIdentityMock = jest.spyOn(accountService, 'identity');

      const result = await firstValueFrom(fixture.resolve(mockActivatedRouteSnapshot));

      expect(accountServiceIdentityMock).not.toHaveBeenCalled();
      expect(apiProjectService.findProjectByToken).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });

    //  it ('does not resolve project if not logged in', async()=>{
    // const accountServiceIdentityMock=  jest.spyOn(accountService, 'identity').mockReturnValue(of(null));
    //    // accountServiceIdentityMock.mockReturnValueOnce(of(null));
    //
    //    const result=await   firstValueFrom(   fixture.resolve(mockActivatedRouteSnapshot));
    //
    //    expect(accountServiceIdentityMock).toHaveBeenCalled();
    //    expect(apiProjectService.findProjectByToken).not.toHaveBeenCalled();
    //    expect(result).toEqual(null);
    //  });
  });
});
