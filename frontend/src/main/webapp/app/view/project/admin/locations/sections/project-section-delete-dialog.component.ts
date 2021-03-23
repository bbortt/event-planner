import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {EventManager} from 'app/core/util/event-manager.service';

import { SectionService } from 'app/entities/section/section.service';

import { Section } from 'app/entities/section/section.model';

@Component({
  templateUrl: './project-section-delete-dialog.component.html',
})
export class ProjectSectionDeleteDialogComponent {
  private section?: Section;

  constructor(protected sectionService: SectionService, public activeModal: NgbActiveModal, protected eventManager: EventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sectionService.delete(id).subscribe(() => {
      this.eventManager.broadcast('sectionListModification');
      this.activeModal.close();
    });
  }
}
