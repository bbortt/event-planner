jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AlertService } from 'app/core/util/alert.service';

import { MemberService } from 'app/entities/member/service/member.service';

import ProjectCreateModalComponent, { ProjectCreateModalContentComponent } from './project-create-modal.component';

import SpyInstance = jest.SpyInstance;

class MockNgbModalRef {
  componentInstance = { project: null };
  result: Promise<any> = new Promise(resolve => resolve(true));
  close = jest.fn();
}

describe('Project Create Modal Component', () => {
  let component: ProjectCreateModalComponent;

  let mockModalRef: NgbModalRef;
  const mockOpen = jest.fn();
  let closeSpy: SpyInstance<void, [result?: any]>;

  let fixture: ComponentFixture<ProjectCreateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProjectCreateModalComponent, ProjectCreateModalContentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        AlertService,
        MemberService,
        {
          provide: NgbModal,
          useValue: {
            open: mockOpen,
          },
        },
      ],
    })
      .overrideTemplate(ProjectCreateModalContentComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    mockModalRef = new MockNgbModalRef() as unknown as NgbModalRef;
    mockOpen.mockReturnValueOnce(mockModalRef);
    closeSpy = jest.spyOn(mockModalRef, 'close');

    fixture = TestBed.createComponent(ProjectCreateModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should open modal', () => {
      component.ngOnInit();

      expect(mockOpen).toHaveBeenCalledWith(ProjectCreateModalContentComponent, { size: 'lg' });
    });
  });

  describe('ngOnDestroy', () => {
    it('should close modal', () => {
      // @ts-ignore: force this private property value for testing
      component.modalRef = mockModalRef;

      component.ngOnDestroy();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
