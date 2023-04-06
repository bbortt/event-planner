import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { IProject } from 'app/entities/project/project.model';

import { ProjectMemberInviteModalComponent, ProjectMemberInviteModalContentComponent } from './project-member-invite-modal.component';

class MockNgbModalRef {
  componentInstance = { project: null };
  result: Promise<any> = new Promise(resolve => resolve(true));
  close = jest.fn();
}

describe('ProjectMemberInviteModalComponent', () => {
  const project: IProject = { id: 1234 };

  let component: ProjectMemberInviteModalComponent;
  let modalService: NgbModal;

  let mockModalRef: NgbModalRef;
  let closeSpy: jest.SpyInstance<void, [result?: any]>;

  let fixture: ComponentFixture<ProjectMemberInviteModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectMemberInviteModalComponent, ProjectMemberInviteModalContentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ project }),
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

    fixture = TestBed.createComponent(ProjectMemberInviteModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    const modalSpy = jest.spyOn(modalService, 'open').mockReturnValueOnce(mockModalRef);

    component.ngOnInit();

    expect(modalSpy).toHaveBeenCalledWith(ProjectMemberInviteModalContentComponent, { size: 'lg' });
    expect(mockModalRef.componentInstance.project).toEqual(project);
  });

  it('should close modal', () => {
    // @ts-ignore: force this private property value for testing.
    component.modalRef = mockModalRef;

    component.ngOnDestroy();

    expect(closeSpy).toHaveBeenCalled();
  });
});
