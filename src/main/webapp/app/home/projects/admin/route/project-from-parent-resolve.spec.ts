import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom } from 'rxjs';

import { projectFromParentRoute } from './project-from-parent-resolve';

describe('Project from parent routing resolve service', () => {
  let mockResolveParent: jest.Mock;

  let mockRouter: Router;

  beforeEach(() => {
    mockResolveParent = jest.fn();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
    });

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
  });

  describe('resolve', () => {
    it('should return IProject returned by parent', async () => {
      const mockProjectId = 123;

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() =>
          projectFromParentRoute({ parent: { data: { project: { id: mockProjectId } } } }, mockRouter.routerState.snapshot)
        )
      );

      expect(result).toEqual({ id: mockProjectId });
    });

    it('should return null if parent is not provided', async () => {
      mockResolveParent.mockReturnValueOnce(null);

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => projectFromParentRoute({ parent: null }, mockRouter.routerState.snapshot))
      );

      expect(result).toEqual(null);
    });
  });
});
