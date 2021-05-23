import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EventManager } from 'app/core/util/event-manager.service';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Responsibility } from 'app/entities/responsibility/responsibility.model';

@Component({
  templateUrl: './project-responsibility-delete-dialog.component.html',
})
export class ProjectResponsibilityDeleteDialogComponent {
  responsibility?: Responsibility;

  constructor(
    private responsibilityService: ResponsibilityService,
    public activeModal: NgbActiveModal,
    private eventManager: EventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.responsibilityService.delete(id).subscribe(() => {
      this.eventManager.broadcast('responsibilityListModification');
      this.activeModal.close();
    });
  }
}
