import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { ILocation } from 'app/entities/location/location.model';
import { IProject } from 'app/entities/project/project.model';

import { ProjectLocationUpdateModalComponent } from './project-location-update-modal.component';
import { ProjectLocationUpdateComponent } from './project-location-update.component';

class MockNgbModalRef {
  componentInstance = { project: null };
  result: Promise<any> = new Promise(resolve => resolve(true));
  close = jest.fn();
}

const location: ILocation = { id: 1234 };
const project: IProject = { id: 1234 };

describe('Project Location Update Modal Component', () => {
  let component: ProjectLocationUpdateModalComponent;
  let modalService: NgbModal;

  let mockModalRef: NgbModalRef;
  let closeSpy: jest.SpyInstance<void, [result?: any]>;

  let fixture: ComponentFixture<ProjectLocationUpdateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectLocationUpdateComponent, ProjectLocationUpdateModalComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ location, project }),
          },
        },
        NgbModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    modalService = TestBed.inject(NgbModal);

    mockModalRef = new MockNgbModalRef() as unknown as NgbModalRef;
    closeSpy = jest.spyOn(mockModalRef, 'close');

    fixture = TestBed.createComponent(ProjectLocationUpdateModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    const modalSpy = jest.spyOn(modalService, 'open').mockReturnValueOnce(mockModalRef);

    component.ngOnInit();

    expect(modalSpy).toHaveBeenCalledWith(ProjectLocationUpdateComponent, { size: 'lg' });
    expect(mockModalRef.componentInstance.location).toEqual(location);
    expect(mockModalRef.componentInstance.project).toEqual(project);
  });

  it('should close modal', () => {
    // @ts-ignore: force this private property value for testing.
    component.modalRef = mockModalRef;

    component.ngOnDestroy();

    expect(closeSpy).toHaveBeenCalled();
  });
});
