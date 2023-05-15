import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { firstValueFrom, isEmpty, Observable, of } from 'rxjs';

import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';

import { projectById } from './project-routing-resolve';

describe('Project by ID', () => {
  let projectService: ProjectService;

  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
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

    projectService = TestBed.inject(ProjectService);

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
  });

  describe('resolve', () => {
    it('should return IProject returned by find', async () => {
      projectService.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectById(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot))
      );

      expect(result).toEqual({ id: 123 });
      expect(projectService.find).toBeCalledWith(123);
    });

    it('should return null if id is not provided', async () => {
      projectService.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectById(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot))
      );

      expect(result).toEqual(null);
      expect(projectService.find).not.toBeCalled();
    });

    it('should route to 404 page if data not found in server', async () => {
      jest.spyOn(projectService, 'find').mockReturnValue(of(new HttpResponse<IProject>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      const result = await firstValueFrom(
        (
          TestBed.runInInjectionContext(() =>
            projectById(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot)
          ) as Observable<IProject | null>
        ).pipe(isEmpty())
      );

      expect(result).toBeTruthy();
      expect(projectService.find).toBeCalledWith(123);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('404');
    });
  });
});
