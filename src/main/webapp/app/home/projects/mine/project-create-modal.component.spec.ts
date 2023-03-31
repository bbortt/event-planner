import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { ProjectCreateModalComponent, ProjectCreateModalContentComponent } from './project-create-modal.component';

class MockNgbModalRef {
  componentInstance = { project: null };
  result: Promise<any> = new Promise(resolve => resolve(true));
  close = jest.fn();
}

describe('ProjectCreateModalComponent', () => {
  let component: ProjectCreateModalComponent;
  let modalService: NgbModal;

  let mockModalRef: NgbModalRef;
  let closeSpy: jest.SpyInstance<void, [result?: any]>;

  let fixture: ComponentFixture<ProjectCreateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectCreateModalComponent, ProjectCreateModalContentComponent],
      providers: [NgbModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    modalService = TestBed.inject(NgbModal);

    mockModalRef = new MockNgbModalRef() as unknown as NgbModalRef;
    closeSpy = jest.spyOn(mockModalRef, 'close');

    fixture = TestBed.createComponent(ProjectCreateModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    const modalSpy = jest.spyOn(modalService, 'open').mockReturnValueOnce(mockModalRef);

    component.ngOnInit();

    expect(modalSpy).toHaveBeenCalledWith(ProjectCreateModalContentComponent, { size: 'lg' });
  });

  it('should close modal', () => {
    // @ts-ignore: force this private property value for testing.
    component.modalRef = mockModalRef;

    component.ngOnDestroy();

    expect(closeSpy).toHaveBeenCalled();
  });
});
