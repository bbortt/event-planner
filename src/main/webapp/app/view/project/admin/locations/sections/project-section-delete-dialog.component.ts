import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Section } from 'app/shared/model/section.model';
import { SectionService } from 'app/entities/section/section.service';

@Component({
  templateUrl: './project-section-delete-dialog.component.html',
})
export class ProjectSectionDeleteDialogComponent {
  private _section?: Section;

  constructor(protected sectionService: SectionService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  public set section(section: Section) {
    this._section = section;
  }

  public get section(): Section {
    return this._section!;
  }

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
