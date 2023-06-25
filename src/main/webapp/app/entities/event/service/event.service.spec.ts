import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEvent } from '../event.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../event.test-samples';

import { EventService, RestEvent } from './event.service';

const requireRestSample: RestEvent = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Event Service', () => {
  let service: EventService;
  let httpMock: HttpTestingController;
  let expectedResult: IEvent | IEvent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Event', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const event = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(event).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Event', () => {
      const event = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(event).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Event', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Event', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Event', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEventToCollectionIfMissing', () => {
      it('should add a Event to an empty array', () => {
        const event: IEvent = sampleWithRequiredData;
        expectedResult = service.addEventToCollectionIfMissing([], event);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(event);
      });

      it('should not add a Event to an array that contains it', () => {
        const event: IEvent = sampleWithRequiredData;
        const eventCollection: IEvent[] = [
          {
            ...event,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEventToCollectionIfMissing(eventCollection, event);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Event to an array that doesn't contain it", () => {
        const event: IEvent = sampleWithRequiredData;
        const eventCollection: IEvent[] = [sampleWithPartialData];
        expectedResult = service.addEventToCollectionIfMissing(eventCollection, event);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(event);
      });

      it('should add only unique Event to an array', () => {
        const eventArray: IEvent[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const eventCollection: IEvent[] = [sampleWithRequiredData];
        expectedResult = service.addEventToCollectionIfMissing(eventCollection, ...eventArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const event: IEvent = sampleWithRequiredData;
        const event2: IEvent = sampleWithPartialData;
        expectedResult = service.addEventToCollectionIfMissing([], event, event2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(event);
        expect(expectedResult).toContain(event2);
      });

      it('should accept null and undefined values', () => {
        const event: IEvent = sampleWithRequiredData;
        expectedResult = service.addEventToCollectionIfMissing([], null, event, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(event);
      });

      it('should return initial array if no Event is added', () => {
        const eventCollection: IEvent[] = [sampleWithRequiredData];
        expectedResult = service.addEventToCollectionIfMissing(eventCollection, undefined, null);
        expect(expectedResult).toEqual(eventCollection);
      });
    });

    describe('compareEvent', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEvent(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEvent(entity1, entity2);
        const compareResult2 = service.compareEvent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEvent(entity1, entity2);
        const compareResult2 = service.compareEvent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEvent(entity1, entity2);
        const compareResult2 = service.compareEvent(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
