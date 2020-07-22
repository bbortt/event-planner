import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProject } from 'app/shared/model/project.model';
import { ProjectService } from './project.service';

@Component({
  templateUrl: './project-delete-dialog.component.html',
})
export class ProjectDeleteDialogComponent {
  project?: IProject;

  constructor(protected projectService: ProjectService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectService.delete(id).subscribe(() => {
      this.eventManager.broadcast('projectListModification');
      this.activeModal.close();
    });
  }
}
