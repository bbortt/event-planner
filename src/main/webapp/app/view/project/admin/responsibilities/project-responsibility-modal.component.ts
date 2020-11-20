import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProjectResponsibilityUpdateComponent } from 'app/view/project/admin/responsibilities/project-responsibility-update.component';

@Component({
  template: '',
})
export class ProjectResponsibilityModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private eventManager: JhiEventManager, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.activatedRoute.data.subscribe(({ project, responsibility }) => {
      this.modalRef = this.modalService.open(ProjectResponsibilityUpdateComponent, {
        beforeDismiss(): boolean {
          window.history.back();
          return true;
        },
      });
      (this.modalRef.componentInstance as ProjectResponsibilityUpdateComponent).updateForm(project, responsibility ? responsibility : {});
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }

    this.eventManager.broadcast('responsibilityListModification');
  }
}
