import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IResponsibility } from 'app/shared/model/responsibility.model';
import { ResponsibilityService } from './responsibility.service';

@Component({
  templateUrl: './responsibility-delete-dialog.component.html',
})
export class ResponsibilityDeleteDialogComponent {
  responsibility?: IResponsibility;

  constructor(
    protected responsibilityService: ResponsibilityService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
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
