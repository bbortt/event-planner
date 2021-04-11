import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProjectCreateComponent } from 'app/view/create-project/project-create.component';

@Component({
  template: '',
  styleUrls: ['./create-project-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateProjectModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  ngAfterViewInit(): void {
    this.modalRef = this.modalService.open(ProjectCreateComponent, {
      beforeDismiss(): boolean {
        window.history.back();
        return true;
      },
    });

    (this.modalRef.componentInstance as ProjectCreateComponent).cancelEnabled = false;
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
