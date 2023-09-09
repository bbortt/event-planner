jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, UrlSegment } from '@angular/router';

import { of } from 'rxjs';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TranslateModule } from '@ngx-translate/core';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { IProject } from 'app/entities/project/project.model';

import ProjectLocationUpdateModalComponent from './project-location-update-modal.component';
import ProjectLocationUpdateComponent from './project-location-update.component';

import SpyInstance = jest.SpyInstance;

class MockNgbModalRef {
  componentInstance = { project: null };
  result: Promise<any> = new Promise(resolve => resolve(true));
  close = jest.fn();
}

const location: ILocation = { id: 1234 };
const project: IProject = { id: 1234 };

describe('Project Location Update Modal Component', () => {
  let mockActivatedRoute: ActivatedRoute;

  let mockModalRef: NgbModalRef;
  const mockOpen = jest.fn();
  let closeSpy: SpyInstance<void, [result?: any]>;

  let fixture: ComponentFixture<ProjectLocationUpdateModalComponent>;
  let component: ProjectLocationUpdateModalComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), ProjectLocationUpdateModalComponent, ProjectLocationUpdateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ location, project }),
            url: of([]),
          },
        },
        LocationService,
        {
          provide: NgbModal,
          useValue: {
            open: mockOpen,
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    mockActivatedRoute = TestBed.inject(ActivatedRoute);

    mockModalRef = new MockNgbModalRef() as unknown as NgbModalRef;
    mockOpen.mockReturnValueOnce(mockModalRef);
    closeSpy = jest.spyOn(mockModalRef, 'close');

    // @ts-ignore
    mockModalRef.componentInstance = jest.mocked({ lateInit: jest.fn() });

    fixture = TestBed.createComponent(ProjectLocationUpdateModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open new modal', () => {
    mockActivatedRoute.url = of([new UrlSegment('new', {})]);

    component.ngOnInit();

    expect(mockModalRef.componentInstance.lateInit).toHaveBeenCalled();
    expect(mockOpen).toHaveBeenCalledWith(ProjectLocationUpdateComponent, { size: 'lg' });

    expect(mockModalRef.componentInstance.existingLocation).toBeUndefined();
    expect(mockModalRef.componentInstance.parentLocation).toEqual(location);
    expect(mockModalRef.componentInstance.project).toEqual(project);
  });

  it('should open update modal', () => {
    component.ngOnInit();

    expect(mockModalRef.componentInstance.lateInit).toHaveBeenCalled();
    expect(mockOpen).toHaveBeenCalledWith(ProjectLocationUpdateComponent, { size: 'lg' });

    expect(mockModalRef.componentInstance.existingLocation).toEqual(location);
    expect(mockModalRef.componentInstance.parentLocation).toBeUndefined();
    expect(mockModalRef.componentInstance.project).toEqual(project);
  });

  it('should open modal without any location value', () => {
    mockActivatedRoute.data = of({ project });

    component.ngOnInit();

    expect(mockModalRef.componentInstance.lateInit).toHaveBeenCalled();
    expect(mockOpen).toHaveBeenCalledWith(ProjectLocationUpdateComponent, { size: 'lg' });

    expect(mockModalRef.componentInstance.existingLocation).toBeUndefined();
    expect(mockModalRef.componentInstance.parentLocation).toBeUndefined();
    expect(mockModalRef.componentInstance.project).toEqual(project);
  });

  it('should close modal', () => {
    // @ts-ignore: force this private property value for testing
    component.modalRef = mockModalRef;

    component.ngOnDestroy();

    expect(closeSpy).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
