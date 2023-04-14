jest.mock('app/core/auth/account.service');

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Router } from '@angular/router';

import { firstValueFrom, of } from 'rxjs';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Project, ProjectService as ApiProjectService } from 'app/api';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

import { ProjectTokenRoutingResolveService } from './project-token-routing-resolve.service';

const project = {} as Project;

describe('Project token routing resolve service', () => {
  let mockAccountService: AccountService;
  let apiProjectService: ApiProjectService;
  let mockRouter: Router;

  let mockTranslateService: TranslateService;

  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;

  let fixture: ProjectTokenRoutingResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
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

    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));

    apiProjectService = TestBed.inject(ApiProjectService);
    apiProjectService.findProjectByToken = jest.fn();

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));

    mockTranslateService = TestBed.inject(TranslateService);
    jest.spyOn(mockTranslateService, 'use').mockImplementation(() => of(''));

    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    mockActivatedRouteSnapshot.params = { token: '0c4b3e09-525a-45e5-afe4-4557838aa361' };

    fixture = TestBed.inject(ProjectTokenRoutingResolveService);
  });

  describe('resolve', () => {
    it('should return null if token is not provided', async () => {
      mockActivatedRouteSnapshot.params = {};

      const result = await firstValueFrom(fixture.resolve(mockActivatedRouteSnapshot));

      expect(mockAccountService.identity).not.toHaveBeenCalled();
      expect(apiProjectService.findProjectByToken).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });

    it('does resolve project if logged in', async () => {
      (mockAccountService.identity as jest.Mock).mockReturnValueOnce(of({} as Account));
      (apiProjectService.findProjectByToken as jest.Mock).mockReturnValueOnce(of({ body: project }));

      const result = await firstValueFrom(fixture.resolve(mockActivatedRouteSnapshot));

      expect(mockAccountService.identity).toHaveBeenCalled();
      expect(apiProjectService.findProjectByToken).toHaveBeenCalledWith('0c4b3e09-525a-45e5-afe4-4557838aa361', 'response');
      expect(result).toEqual(project);
    });

    it('does not resolve project if not logged in', async () => {
      (apiProjectService.findProjectByToken as jest.Mock).mockReturnValueOnce(of({ body: project }));

      const result = await firstValueFrom(fixture.resolve(mockActivatedRouteSnapshot));

      expect(mockAccountService.identity).toHaveBeenCalled();
      expect(apiProjectService.findProjectByToken).toHaveBeenCalledWith('0c4b3e09-525a-45e5-afe4-4557838aa361', 'response');
      expect(result).toEqual(null);
    });
  });
});
