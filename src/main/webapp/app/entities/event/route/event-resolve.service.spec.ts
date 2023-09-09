import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { firstValueFrom, isEmpty, Observable, of } from 'rxjs';

import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';

import { eventById } from './event-resolve.service';
import { ILocation } from '../../location/location.model';

const event = { id: 1234 } as IEvent;

describe('Event routing resolve service', () => {
  let eventService: EventService;

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
    eventService = TestBed.inject(EventService);

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    // @ts-ignore: using a natural Map is ok for testing
    mockActivatedRouteSnapshot.paramMap = new Map().set('eventId', event.id);
  });

  describe('resolve', () => {
    it('should return IEvent returned by find', async () => {
      eventService.find = jest.fn(id => of(new HttpResponse({ body: { id } })));

      const result = await firstValueFrom(
        // @ts-ignore: skip conversion for testing
        TestBed.runInInjectionContext(() => eventById(mockActivatedRouteSnapshot)),
      );

      expect(result).toEqual({ id: event.id });
      expect(eventService.find).toBeCalledWith(event.id);
    });

    it('should return null if id is not provided', async () => {
      eventService.find = jest.fn();
      // @ts-ignore: using a natural Map is ok for testing
      mockActivatedRouteSnapshot.paramMap = new Map();

      const result = await firstValueFrom(
        // @ts-ignore: skip conversion for testing
        TestBed.runInInjectionContext(() => eventById(mockActivatedRouteSnapshot)),
      );

      expect(result).toEqual(null);
      expect(eventService.find).not.toBeCalled();
    });

    it('should route to 404 page if data not found in server', async () => {
      jest.spyOn(eventService, 'find').mockReturnValue(of(new HttpResponse<IEvent>({ body: null })));

      const result = await firstValueFrom(
        // @ts-ignore: skip conversion for testing
        (TestBed.runInInjectionContext(() => eventById(mockActivatedRouteSnapshot)) as Observable<ILocation | null>).pipe(isEmpty()),
      );

      expect(result).toBeTruthy();
      expect(eventService.find).toBeCalledWith(event.id);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('404');
    });
  });
});
