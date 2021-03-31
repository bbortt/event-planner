import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { User, IUser } from './user.model';

import { UserService } from './user.service';

describe('Service Tests', () => {
  describe('User Service', () => {
    let service: UserService;
    let httpMock: HttpTestingController;
    let expectedResult: IUser | IUser[] | boolean | number | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UserService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should return Users', () => {
        service.query().subscribe(received => {
          expectedResult = received.body;
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([new User('ABC', 'user')]);
        expect(expectedResult).toEqual([{ id: 'ABC', login: 'user' }]);
      });

      it('should propagate not found response', () => {
        service.query().subscribe({
          error: (error: HttpErrorResponse) => (expectedResult = error.status),
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush('Internal Server Error', {
          status: 500,
          statusText: 'Inernal Server Error',
        });
        expect(expectedResult).toEqual(500);
      });
    });
  });
});
