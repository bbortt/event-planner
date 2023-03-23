import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Subject } from 'rxjs';

import { IMember } from '../member.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../member.test-samples';

import { MemberService, RestMember } from './member.service';

const requireRestSample: RestMember = {
  ...sampleWithRequiredData,
  acceptedDate: sampleWithRequiredData.acceptedDate?.toJSON(),
};

describe('Member Service', () => {
  let service: MemberService;
  let httpMock: HttpTestingController;
  let expectedResult: IMember | IMember[] | boolean | null;

  const memberEventsSubject = new Subject<IMember>();
  const nextMemberEvent = jest.spyOn(memberEventsSubject, 'next');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MemberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    // @ts-ignore: force this private property value for testing.
    service.memberUpdatedSource = memberEventsSubject;
    nextMemberEvent.mockReset();
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

    it('should create a Member', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const member = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(member).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);

      expect(nextMemberEvent).toHaveBeenCalledWith(expected);
    });

    it('should update a Member', () => {
      const member = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(member).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);

      expect(nextMemberEvent).toHaveBeenCalledWith(expected);
    });

    it('should partial update a Member', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);

      expect(nextMemberEvent).toHaveBeenCalledWith(expected);
    });

    it('should return a list of Member', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Member', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMemberToCollectionIfMissing', () => {
      it('should add a Member to an empty array', () => {
        const member: IMember = sampleWithRequiredData;
        expectedResult = service.addMemberToCollectionIfMissing([], member);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(member);
      });

      it('should not add a Member to an array that contains it', () => {
        const member: IMember = sampleWithRequiredData;
        const memberCollection: IMember[] = [
          {
            ...member,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMemberToCollectionIfMissing(memberCollection, member);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Member to an array that doesn't contain it", () => {
        const member: IMember = sampleWithRequiredData;
        const memberCollection: IMember[] = [sampleWithPartialData];
        expectedResult = service.addMemberToCollectionIfMissing(memberCollection, member);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(member);
      });

      it('should add only unique Member to an array', () => {
        const memberArray: IMember[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const memberCollection: IMember[] = [sampleWithRequiredData];
        expectedResult = service.addMemberToCollectionIfMissing(memberCollection, ...memberArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const member: IMember = sampleWithRequiredData;
        const member2: IMember = sampleWithPartialData;
        expectedResult = service.addMemberToCollectionIfMissing([], member, member2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(member);
        expect(expectedResult).toContain(member2);
      });

      it('should accept null and undefined values', () => {
        const member: IMember = sampleWithRequiredData;
        expectedResult = service.addMemberToCollectionIfMissing([], null, member, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(member);
      });

      it('should return initial array if no Member is added', () => {
        const memberCollection: IMember[] = [sampleWithRequiredData];
        expectedResult = service.addMemberToCollectionIfMissing(memberCollection, undefined, null);
        expect(expectedResult).toEqual(memberCollection);
      });
    });

    describe('compareMember', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMember(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMember(entity1, entity2);
        const compareResult2 = service.compareMember(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMember(entity1, entity2);
        const compareResult2 = service.compareMember(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMember(entity1, entity2);
        const compareResult2 = service.compareMember(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
