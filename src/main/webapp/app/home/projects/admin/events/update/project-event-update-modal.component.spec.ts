jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { IEvent } from 'app/entities/event/event.model';

import ProjectEventUpdateModalComponent from './project-event-update-modal.component';
import ProjectEventUpdateComponent from './project-event-update.component';

import SpyInstance = jest.SpyInstance;

class MockNgbModalRef {
  componentInstance = { project: null };
  result: Promise<any> = new Promise(resolve => resolve(true));
  close = jest.fn();
}

const event: IEvent = { id: 1234 };

describe('Project Event Update Modal Component', () => {
  let mockActivatedRoute: ActivatedRoute;

  let mockModalRef: NgbModalRef;
  const mockOpen = jest.fn();
  let closeSpy: SpyInstance<void, [result?: any]>;

  let fixture: ComponentFixture<ProjectEventUpdateModalComponent>;
  let component: ProjectEventUpdateModalComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProjectEventUpdateModalComponent, ProjectEventUpdateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ event }),
            url: of([]),
          },
        },
        {
          provide: NgbModal,
          useValue: {
            open: mockOpen,
          },
        },
      ],
    })
      .overrideTemplate(ProjectEventUpdateComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    mockActivatedRoute = TestBed.inject(ActivatedRoute);

    mockModalRef = new MockNgbModalRef() as unknown as NgbModalRef;
    mockOpen.mockReturnValueOnce(mockModalRef);
    closeSpy = jest.spyOn(mockModalRef, 'close');

    // @ts-ignore
    mockModalRef.componentInstance = jest.mocked({ loadRelationshipsOptions: jest.fn(), updateForm: jest.fn() });

    fixture = TestBed.createComponent(ProjectEventUpdateModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open new modal', () => {
    mockActivatedRoute.data = of({});

    component.ngOnInit();

    expect(mockModalRef.componentInstance.loadRelationshipsOptions).toHaveBeenCalled();
    expect(mockOpen).toHaveBeenCalledWith(ProjectEventUpdateComponent, { size: 'lg' });

    expect(mockModalRef.componentInstance.event).toBeUndefined();
    expect(mockModalRef.componentInstance.updateForm).not.toHaveBeenCalled();
  });

  it('should open update modal', () => {
    component.ngOnInit();

    expect(mockModalRef.componentInstance.loadRelationshipsOptions).toHaveBeenCalled();
    expect(mockOpen).toHaveBeenCalledWith(ProjectEventUpdateComponent, { size: 'lg' });

    expect(mockModalRef.componentInstance.event).toEqual(event);
    expect(mockModalRef.componentInstance.updateForm).toHaveBeenCalled();
  });

  it('should close modal', () => {
    // @ts-ignore: force this private property value for testing.
    component.modalRef = mockModalRef;

    component.ngOnDestroy();

    expect(closeSpy).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
