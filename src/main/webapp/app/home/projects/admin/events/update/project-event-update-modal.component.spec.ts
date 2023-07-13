import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { IEvent } from 'app/entities/event/event.model';

import { ProjectEventUpdateModalComponent } from './project-event-update-modal.component';
import { ProjectEventUpdateComponent } from './project-event-update.component';

class MockNgbModalRef {
  componentInstance = { project: null };
  result: Promise<any> = new Promise(resolve => resolve(true));
  close = jest.fn();
}

const event: IEvent = { id: 1234 };

describe('Project Event Update Modal Component', () => {
  let mockActivatedRoute: ActivatedRoute;

  let modalService: NgbModal;

  let mockModalRef: NgbModalRef;
  let closeSpy: jest.SpyInstance<void, [result?: any]>;

  let fixture: ComponentFixture<ProjectEventUpdateModalComponent>;
  let component: ProjectEventUpdateModalComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectEventUpdateComponent, ProjectEventUpdateModalComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ event }),
            url: of([]),
          },
        },
        NgbModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    mockActivatedRoute = TestBed.inject(ActivatedRoute);

    modalService = TestBed.inject(NgbModal);

    mockModalRef = new MockNgbModalRef() as unknown as NgbModalRef;
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

    const modalSpy = jest.spyOn(modalService, 'open').mockReturnValueOnce(mockModalRef);

    component.ngOnInit();

    expect(mockModalRef.componentInstance.loadRelationshipsOptions).toHaveBeenCalled();
    expect(modalSpy).toHaveBeenCalledWith(ProjectEventUpdateComponent, { size: 'lg' });

    expect(mockModalRef.componentInstance.event).toBeUndefined();
    expect(mockModalRef.componentInstance.updateForm).not.toHaveBeenCalled();
  });

  it('should open update modal', () => {
    const modalSpy = jest.spyOn(modalService, 'open').mockReturnValueOnce(mockModalRef);

    component.ngOnInit();

    expect(mockModalRef.componentInstance.loadRelationshipsOptions).toHaveBeenCalled();
    expect(modalSpy).toHaveBeenCalledWith(ProjectEventUpdateComponent, { size: 'lg' });

    expect(mockModalRef.componentInstance.event).toEqual(event);
    expect(mockModalRef.componentInstance.updateForm).toHaveBeenCalled();
  });

  it('should close modal', () => {
    // @ts-ignore: force this private property value for testing.
    component.modalRef = mockModalRef;

    component.ngOnDestroy();

    expect(closeSpy).toHaveBeenCalled();
  });
});
