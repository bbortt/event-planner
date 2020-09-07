import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProjectCreateComponent } from 'app/entities/project/project-create.component';

@Component({
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateProjectModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private eventManager: JhiEventManager) {}

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

    this.eventManager.broadcast('myProjectsListModification');
  }
}
