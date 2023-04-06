import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { IProject } from 'app/entities/project/project.model';

import { ProjectFromParentResolveService } from './project-from-parent-resolve.service';

describe('Project from parent routing resolve service', () => {
  let mockResolveParent: jest.Mock;

  let mockRouter: Router;
  let resultProject: IProject | null | undefined;

  let fixture: ProjectFromParentResolveService;

  beforeEach(() => {
    mockResolveParent = jest.fn();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
    });

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));

    fixture = TestBed.inject(ProjectFromParentResolveService);

    resultProject = undefined;
  });

  describe('resolve', () => {
    it('should return IProject returned by parent', () => {
      const mockProjectId = 123;

      fixture.resolve({ parent: { data: { project: { id: mockProjectId } } } } as unknown as ActivatedRouteSnapshot).subscribe(result => {
        resultProject = result;
      });

      expect(resultProject).toEqual({ id: mockProjectId });
    });

    it('should return null if parent is not provided', () => {
      mockResolveParent.mockReturnValueOnce(null);

      fixture.resolve({ parent: null } as ActivatedRouteSnapshot).subscribe(result => {
        resultProject = result;
      });

      expect(resultProject).toEqual(null);
    });
  });
});
