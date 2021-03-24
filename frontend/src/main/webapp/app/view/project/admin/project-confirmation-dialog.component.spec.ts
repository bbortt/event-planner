jest.mock('@ng-bootstrap/ng-bootstrap')
jest.mock('app/core/util/event-manager.service');

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { of } from 'rxjs';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {EventManager} from 'app/core/util/event-manager.service';

import {ProjectService} from 'app/entities/project/project.service';

import {ProjectConfirmationDialogComponent} from 'app/view/project/admin/project-confirmation-dialog.component';

describe('Component Tests', () => {
  describe('Project Confirm Dialog Component', () => {
    let comp: ProjectConfirmationDialogComponent;
    let fixture: ComponentFixture<ProjectConfirmationDialogComponent>;
    let mockEventManager: EventManager;
    let mockActiveModal: NgbActiveModal;
    let projectService:ProjectService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports:[HttpClientTestingModule,TranslateModule.forRoot()],
          declarations: [ProjectConfirmationDialogComponent],
          providers: [NgbActiveModal,EventManager]
        })
          .overrideTemplate(ProjectConfirmationDialogComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(ProjectConfirmationDialogComponent);
      comp = fixture.componentInstance;
      mockEventManager = TestBed.inject(EventManager);
      mockActiveModal = TestBed.inject(NgbActiveModal);
      projectService = TestBed.inject(ProjectService);
    });

    describe('confirm', () => {
      it('Should call delete service on confirm',  () => {
        // GIVEN
        const projectId = 1;
        spyOn(projectService, 'delete').and.returnValue(of({}));
        spyOn(projectService, 'archive').and.returnValue(of({}));

        // WHEN
        comp.delete = true;
        comp.confirm(projectId);

        // THEN
        expect(projectService.delete).toHaveBeenCalledWith(projectId);
        expect(projectService.archive).not.toHaveBeenCalled();
        expect(mockActiveModal.close).toHaveBeenCalled();
        expect(mockEventManager.broadcast).toHaveBeenCalled();
      });

      it('Should call archive service on confirm', () => {
        // GIVEN
        const projectId = 1;
        spyOn(projectService, 'delete').and.returnValue(of({}));
        spyOn(projectService, 'archive').and.returnValue(of({}));

        // WHEN
        comp.archive = true;
        comp.confirm(projectId);

        // THEN
        expect(projectService.delete).not.toHaveBeenCalled();
        expect(projectService.archive).toHaveBeenCalledWith(projectId);
        expect(mockActiveModal.close).toHaveBeenCalled();
        expect(mockEventManager.broadcast).toHaveBeenCalled();
      });
    });
  });
});
