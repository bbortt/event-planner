import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { of } from 'rxjs';

import { JhiEventManager } from 'ng-jhipster';

import { EventPlannerTestModule } from '../../../../test.module';
import { MockEventManager } from '../../../../helpers/mock-event-manager.service';
import { MockActiveModal } from '../../../../helpers/mock-active-modal.service';

import { ProjectService } from 'app/entities/project/project.service';

import { ProjectConfirmationDialogComponent } from 'app/view/project/admin/project-confirmation-dialog.component';

describe('Component Tests', () => {
  describe('Project Confirm Dialog Component', () => {
    let comp: ProjectConfirmationDialogComponent;
    let fixture: ComponentFixture<ProjectConfirmationDialogComponent>;
    let service: ProjectService;
    let mockEventManager: MockEventManager;
    let mockActiveModal: MockActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [ProjectConfirmationDialogComponent],
      })
        .overrideTemplate(ProjectConfirmationDialogComponent, '')
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ProjectConfirmationDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProjectService);
      mockEventManager = TestBed.get(JhiEventManager);
      mockActiveModal = TestBed.get(NgbActiveModal);
    });

    describe('confirm', () => {
      it('Should call delete service on confirm', inject([], () => {
        // GIVEN
        const projectId = 1;
        spyOn(service, 'delete').and.returnValue(of({}));
        spyOn(service, 'archive').and.returnValue(of({}));

        // WHEN
        comp.delete = true;
        comp.confirm(projectId);

        // THEN
        expect(service.delete).toHaveBeenCalledWith(projectId);
        expect(service.archive).not.toHaveBeenCalled();
        expect(mockActiveModal.closeSpy).toHaveBeenCalled();
        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
      }));

      it('Should call archive service on confirm', inject([], () => {
        // GIVEN
        const projectId = 1;
        spyOn(service, 'delete').and.returnValue(of({}));
        spyOn(service, 'archive').and.returnValue(of({}));

        // WHEN
        comp.archive = true;
        comp.confirm(projectId);

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(service.archive).toHaveBeenCalledWith(projectId);
        expect(mockActiveModal.closeSpy).toHaveBeenCalled();
        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
      }));
    });
  });
});
