import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom, isEmpty, Observable, of } from 'rxjs';

import { IMember } from '../member.model';
import { MemberService } from '../service/member.service';

import { memberById } from './member-resolve.service';

const member = { id: 1234 } as IMember;

describe('Member Resolve Service', () => {
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
    // @ts-ignore using a natural Map is ok for testing
    mockActivatedRouteSnapshot.paramMap = new Map().set('memberId', member.id);
  });

  describe('memberById', () => {
    it('should return IMember returned by find', async () => {
      memberService.find = jest.fn(id => of(new HttpResponse({ body: { id } })));

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => memberById(mockActivatedRouteSnapshot)),
      );

      expect(result).toEqual({ id: member.id });
      expect(memberService.find).toBeCalledWith(member.id);
    });

    it('should return null if id is not provided', async () => {
      memberService.find = jest.fn();
      // @ts-ignore using a natural Map is ok for testing
      mockActivatedRouteSnapshot.paramMap = new Map();

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        TestBed.runInInjectionContext(() => memberById(mockActivatedRouteSnapshot)),
      );

      expect(result).toEqual(null);
      expect(memberService.find).not.toBeCalled();
    });

    it('should route to 404 page if data not found in server', async () => {
      jest.spyOn(memberService, 'find').mockReturnValue(of(new HttpResponse<IMember>({ body: null })));

      const result = await firstValueFrom(
        // @ts-ignore skip conversion for testing
        (TestBed.runInInjectionContext(() => memberById(mockActivatedRouteSnapshot)) as Observable<IMember | null>).pipe(isEmpty()),
      );

      expect(result).toBeTruthy();
      expect(memberService.find).toBeCalledWith(member.id);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('404');
    });
  });
});
