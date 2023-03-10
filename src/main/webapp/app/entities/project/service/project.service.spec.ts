import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProject } from '../project.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../project.test-samples';

import { ProjectService, RestProject } from './project.service';

const requireRestSample: RestProject = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Project Service', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;
  let expectedResult: IProject | IProject[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    expectedResult = null;
    service = TestBed.inject(ProjectService);
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

    it('should create a Project', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const project = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(project).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Project', () => {
      const project = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(project).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Project', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Project', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Project', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProjectToCollectionIfMissing', () => {
      it('should add a Project to an empty array', () => {
        const project: IProject = sampleWithRequiredData;
        expectedResult = service.addProjectToCollectionIfMissing([], project);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(project);
      });

      it('should not add a Project to an array that contains it', () => {
        const project: IProject = sampleWithRequiredData;
        const projectCollection: IProject[] = [
          {
            ...project,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProjectToCollectionIfMissing(projectCollection, project);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Project to an array that doesn't contain it", () => {
        const project: IProject = sampleWithRequiredData;
        const projectCollection: IProject[] = [sampleWithPartialData];
        expectedResult = service.addProjectToCollectionIfMissing(projectCollection, project);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(project);
      });

      it('should add only unique Project to an array', () => {
        const projectArray: IProject[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const projectCollection: IProject[] = [sampleWithRequiredData];
        expectedResult = service.addProjectToCollectionIfMissing(projectCollection, ...projectArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const project: IProject = sampleWithRequiredData;
        const project2: IProject = sampleWithPartialData;
        expectedResult = service.addProjectToCollectionIfMissing([], project, project2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(project);
        expect(expectedResult).toContain(project2);
      });

      it('should accept null and undefined values', () => {
        const project: IProject = sampleWithRequiredData;
        expectedResult = service.addProjectToCollectionIfMissing([], null, project, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(project);
      });

      it('should return initial array if no Project is added', () => {
        const projectCollection: IProject[] = [sampleWithRequiredData];
        expectedResult = service.addProjectToCollectionIfMissing(projectCollection, undefined, null);
        expect(expectedResult).toEqual(projectCollection);
      });
    });

    describe('compareProject', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProject(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProject(entity1, entity2);
        const compareResult2 = service.compareProject(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProject(entity1, entity2);
        const compareResult2 = service.compareProject(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProject(entity1, entity2);
        const compareResult2 = service.compareProject(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
