import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom, isEmpty, Observable, of } from 'rxjs';

import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

import { locationById } from './location-resolve.service';

const location = { id: 1234 } as ILocation;

describe('Location Resolve Service', () => {
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
    // @ts-ignore: using a natural Map is ok for testing
    mockActivatedRouteSnapshot.paramMap = new Map().set('locationId', location.id);
  });

  describe('locationById', () => {
    it('should return ILocation returned by find', async () => {
      locationService.find = jest.fn(id => of(new HttpResponse({ body: { id } })));

      const result = await firstValueFrom(
        // @ts-ignore: skip conversion for testing
        TestBed.runInInjectionContext(() => locationById(mockActivatedRouteSnapshot)),
      );

      expect(result).toEqual({ id: location.id });
      expect(locationService.find).toBeCalledWith(location.id);
    });

    it('should return null if id is not provided', async () => {
      locationService.find = jest.fn();
      // @ts-ignore: using a natural Map is ok for testing
      mockActivatedRouteSnapshot.paramMap = new Map();

      const result = await firstValueFrom(
        // @ts-ignore: skip conversion for testing
        TestBed.runInInjectionContext(() => locationById(mockActivatedRouteSnapshot)),
      );

      expect(result).toEqual(null);
      expect(locationService.find).not.toBeCalled();
    });

    it('should route to 404 page if data not found in server', async () => {
      jest.spyOn(locationService, 'find').mockReturnValue(of(new HttpResponse<ILocation>({ body: null })));

      const result = await firstValueFrom(
        // @ts-ignore: skip conversion for testing
        (TestBed.runInInjectionContext(() => locationById(mockActivatedRouteSnapshot)) as Observable<ILocation | null>).pipe(isEmpty()),
      );

      expect(result).toBeTruthy();
      expect(locationService.find).toBeCalledWith(location.id);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('404');
    });
  });
});
