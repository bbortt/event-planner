import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { LocationService } from 'app/entities/location/location.service';
import { Location } from 'app/shared/model/location.model';

describe('Service Tests', () => {
  describe('Location Service', () => {
    let injector: TestBed;
    let service: LocationService;
    let httpMock: HttpTestingController;
    let elemDefault: Location;
    let expectedResult: Location | Location[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(LocationService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        dateFrom: currentDate,
        dateTo: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateFrom: currentDate.format(DATE_TIME_FORMAT),
            dateTo: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Location', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateFrom: currentDate.format(DATE_TIME_FORMAT),
            dateTo: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateFrom: currentDate,
            dateTo: currentDate,
          },
          returnedFromService
        );

        service.create({}).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Location', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            dateFrom: currentDate.format(DATE_TIME_FORMAT),
            dateTo: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateFrom: currentDate,
            dateTo: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Location', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            dateFrom: currentDate.format(DATE_TIME_FORMAT),
            dateTo: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateFrom: currentDate,
            dateTo: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Location', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
