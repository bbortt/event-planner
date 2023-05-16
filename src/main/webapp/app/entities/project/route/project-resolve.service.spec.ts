jest.mock('app/core/auth/account.service');
jest.mock('app/core/util/alert.service');

import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom, isEmpty, Observable, of } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { ProjectService as ApiProjectService } from 'app/api';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';

import { IProject } from '../project.model';

import { ProjectService } from '../service/project.service';
import { projectById, projectByToken } from './project-resolve.service';

const project = { id: 1234, token: '0c4b3e09-525a-45e5-afe4-4557838aa361' } as IProject;

describe('Project Resolve Service', () => {
  let projectService: ProjectService;

  let mockAccountService: AccountService;
  let mockAlertService: AlertService;
  let apiProjectService: ApiProjectService;

  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;

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
        AlertService,
      ],
    });

    projectService = TestBed.inject(ProjectService);

    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));

    mockAlertService = TestBed.inject(AlertService);

    apiProjectService = TestBed.inject(ApiProjectService);
    apiProjectService.findProjectByToken = jest.fn();

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    // @ts-ignore using a natural Map is ok for testing
    mockActivatedRouteSnapshot.paramMap = new Map().set('id', project.id).set('token', project.token);
  });

  describe('projectById', () => {
    it('should return IProject returned by find', async () => {
      projectService.find = jest.fn(id => of(new HttpResponse({ body: { id } })));

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectById(mockActivatedRouteSnapshot))
      );

      expect(result).toEqual({ id: project.id });
      expect(projectService.find).toBeCalledWith(project.id);
    });

    it('should return null if id is not provided', async () => {
      projectService.find = jest.fn();
      // @ts-ignore using a natural Map is ok for testing
      mockActivatedRouteSnapshot.paramMap = new Map();

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectById(mockActivatedRouteSnapshot))
      );

      expect(result).toEqual(null);
      expect(projectService.find).not.toBeCalled();
    });

    it('should route to 404 page if data not found in server', async () => {
      jest.spyOn(projectService, 'find').mockReturnValue(of(new HttpResponse<IProject>({ body: null })));

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        (TestBed.runInInjectionContext(() => projectById(mockActivatedRouteSnapshot)) as Observable<IProject | null>).pipe(isEmpty())
      );

      expect(result).toBeTruthy();
      expect(projectService.find).toBeCalledWith(project.id);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('404');
    });
  });

  describe('projectByToken', () => {
    it('should return null if token is not provided', async () => {
      // @ts-ignore using a natural Map is ok for testing
      mockActivatedRouteSnapshot.paramMap = new Map();

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectByToken(mockActivatedRouteSnapshot))
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
        TestBed.runInInjectionContext(() => projectByToken(mockActivatedRouteSnapshot))
      );

      expect(mockAccountService.identity).toHaveBeenCalled();
      expect(apiProjectService.findProjectByToken).toHaveBeenCalledWith(project.token, 'response');
      expect(result).toEqual(project);
    });

    it('does not resolve project if not logged in', async () => {
      (apiProjectService.findProjectByToken as jest.Mock).mockReturnValueOnce(of({ body: project }));

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectByToken(mockActivatedRouteSnapshot))
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
        TestBed.runInInjectionContext(() => projectByToken(mockActivatedRouteSnapshot))
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
