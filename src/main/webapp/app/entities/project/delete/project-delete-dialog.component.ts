import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

import SharedModule from 'app/shared/shared.module';

import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';

@Component({
  standalone: true,
  templateUrl: './project-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export default class ProjectDeleteDialogComponent {
  project?: IProject;

  constructor(protected projectService: ProjectService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
