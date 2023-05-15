jest.mock('app/core/auth/account.service');
jest.mock('app/core/util/alert.service');

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Router } from '@angular/router';

import { firstValueFrom, of } from 'rxjs';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Project, ProjectService as ApiProjectService } from 'app/api';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';

import { projectByToken } from './resolve-project-by-token';

const project = { token: '0c4b3e09-525a-45e5-afe4-4557838aa361' } as Project;

describe('Project by Token', () => {
  let mockAccountService: AccountService;
  let mockAlertService: AlertService;
  let apiProjectService: ApiProjectService;

  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouter: Router;

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
        AlertService,
      ],
    });

    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));

    mockAlertService = TestBed.inject(AlertService);

    apiProjectService = TestBed.inject(ApiProjectService);
    apiProjectService.findProjectByToken = jest.fn();

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    mockActivatedRouteSnapshot.params = { token: project.token };
  });

  describe('resolve', () => {
    it('should return null if token is not provided', async () => {
      mockActivatedRouteSnapshot.params = {};

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectByToken(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot))
      );

      expect(mockAccountService.identity).not.toHaveBeenCalled();
      expect(apiProjectService.findProjectByToken).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });

    it('does resolve project if logged in', async () => {
      (mockAccountService.identity as jest.Mock).mockReturnValueOnce(of({} as Account));
      (apiProjectService.findProjectByToken as jest.Mock).mockReturnValueOnce(of({ body: project }));

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectByToken(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot))
      );

      expect(mockAccountService.identity).toHaveBeenCalled();
      expect(apiProjectService.findProjectByToken).toHaveBeenCalledWith(project.token, 'response');
      expect(result).toEqual(project);
    });

    it('does not resolve project if not logged in', async () => {
      (apiProjectService.findProjectByToken as jest.Mock).mockReturnValueOnce(of({ body: project }));

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectByToken(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot))
      );

      expect(mockAccountService.identity).toHaveBeenCalled();
      expect(apiProjectService.findProjectByToken).toHaveBeenCalledWith(project.token, 'response');
      expect(result).toEqual(null);
    });

    it('redirects to home page if project has been archived', async () => {
      const archivedProject = { archived: true };

      (mockAccountService.identity as jest.Mock).mockReturnValueOnce(of({} as Account));
      (apiProjectService.findProjectByToken as jest.Mock).mockReturnValueOnce(of({ body: archivedProject }));

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectByToken(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot))
      );

      expect(mockAccountService.identity).toHaveBeenCalled();
      expect(apiProjectService.findProjectByToken).toHaveBeenCalledWith(project.token, 'response');
      expect(result).toEqual(archivedProject);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
      expect(mockAlertService.addAlert).toHaveBeenCalledWith({
        type: 'danger',
        translationKey: 'app.project.invitation.error.invalidToken',
      });
    });
  });
});
