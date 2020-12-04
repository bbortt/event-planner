import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProjectAdminUpdateComponent } from 'app/view/project/admin/project-admin-update.component';

@Component({
  template: '',
})
export class ProjectAdminModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private eventManager: JhiEventManager, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.modalRef = this.modalService.open(ProjectAdminUpdateComponent, {
        beforeDismiss(): boolean {
          window.history.back();
          return true;
        },
      });
      (this.modalRef.componentInstance as ProjectAdminUpdateComponent).updateForm(project);
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }

    // Wie lautet der entsprechender Event?
    // this.eventManager.broadcast('responsibilityListModification');
  }
}
