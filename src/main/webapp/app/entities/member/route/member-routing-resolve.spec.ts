import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { firstValueFrom, isEmpty, Observable, of } from 'rxjs';

import { IMember } from '../member.model';
import { MemberService } from '../service/member.service';

import { memberById } from './member-routing-resolve';

describe('Member by ID', () => {
  let memberService: MemberService;

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

    memberService = TestBed.inject(MemberService);

    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
  });

  describe('resolve', () => {
    it('should return IMember returned by find', async () => {
      memberService.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => memberById(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot))
      );

      expect(result).toEqual({ id: 123 });
      expect(memberService.find).toBeCalledWith(123);
    });

    it('should return null if id is not provided', async () => {
      memberService.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => memberById(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot))
      );

      expect(result).toEqual(null);
      expect(memberService.find).not.toBeCalled();
    });

    it('should route to 404 page if data not found in server', async () => {
      jest.spyOn(memberService, 'find').mockReturnValue(of(new HttpResponse<IMember>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      const result = await firstValueFrom(
        (
          TestBed.runInInjectionContext(() =>
            memberById(mockActivatedRouteSnapshot, mockRouter.routerState.snapshot)
          ) as Observable<IMember | null>
        ).pipe(isEmpty())
      );

      expect(result).toBeTruthy();
      expect(memberService.find).toBeCalledWith(123);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('404');
    });
  });
});
