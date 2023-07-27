jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { IProject } from 'app/entities/project/project.model';

import ProjectMemberInviteModalComponent, { ProjectMemberInviteModalContentComponent } from './project-member-invite-modal.component';

import SpyInstance = jest.SpyInstance;

class MockNgbModalRef {
  componentInstance = { project: null };
  result: Promise<any> = new Promise(resolve => resolve(true));
  close = jest.fn();
}

const project: IProject = { id: 1234 };

describe('Project Member Invite Modal Component', () => {
  let component: ProjectMemberInviteModalComponent;

  let mockModalRef: NgbModalRef;
  const mockOpen = jest.fn();
  let closeSpy: SpyInstance<void, [result?: any]>;

  let fixture: ComponentFixture<ProjectMemberInviteModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProjectMemberInviteModalComponent, ProjectMemberInviteModalContentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ project }),
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
      .overrideTemplate(ProjectMemberInviteModalContentComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    mockModalRef = new MockNgbModalRef() as unknown as NgbModalRef;
    mockOpen.mockReturnValueOnce(mockModalRef);
    closeSpy = jest.spyOn(mockModalRef, 'close');

    fixture = TestBed.createComponent(ProjectMemberInviteModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    component.ngOnInit();

    expect(mockOpen).toHaveBeenCalledWith(ProjectMemberInviteModalContentComponent, { size: 'lg' });
    expect(mockModalRef.componentInstance.project).toEqual(project);
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
