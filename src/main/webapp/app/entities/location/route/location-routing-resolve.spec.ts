import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { first, firstValueFrom, isEmpty, Observable, of } from 'rxjs';

import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

import { locationById } from './location-routing-resolve';

describe('Location by ID', () => {
  let locationService: LocationService;

  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouter: Router;

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

    locationService = TestBed.inject(LocationService);

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
  });

  describe('resolve', () => {
    it('should return ILocation returned by find', async () => {
      locationService.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => locationById(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot))
      );

      expect(result).toEqual({ id: 123 });
      expect(locationService.find).toBeCalledWith(123);
    });

    it('should return null if id is not provided', async () => {
      locationService.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => locationById(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot))
      );

      expect(result).toEqual(null);
      expect(locationService.find).not.toBeCalled();
    });

    it('should route to 404 page if data not found in server', async () => {
      jest.spyOn(locationService, 'find').mockReturnValue(of(new HttpResponse<ILocation>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      const result = await firstValueFrom(
        (
          TestBed.runInInjectionContext(() =>
            locationById(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot)
          ) as Observable<ILocation | null>
        ).pipe(isEmpty())
      );

      expect(result).toBeTruthy();
      expect(locationService.find).toBeCalledWith(123);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('404');
    });
  });
});
