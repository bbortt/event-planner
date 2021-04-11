import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EventManager } from 'app/core/util/event-manager.service';

import { ProjectService } from 'app/entities/project/project.service';

import { Project } from 'app/entities/project/project.model';

@Component({
  templateUrl: './project-confirmation-dialog.component.html',
})
export class ProjectConfirmationDialogComponent {
  project?: Project;

  archive = false;
  delete = false;

  constructor(protected projectService: ProjectService, public activeModal: NgbActiveModal, protected eventManager: EventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirm(id: number): void {
    if (this.archive) {
      this.projectService.archive(id).subscribe(() => {
        this.eventManager.broadcast('projectListModification');
        this.activeModal.close(true);
      });
    } else if (this.delete) {
      this.projectService.delete(id).subscribe(() => {
        this.eventManager.broadcast('projectListModification');
        this.activeModal.close(true);
      });
    }
  }
}
