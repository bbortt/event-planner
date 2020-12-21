import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProjectLocationUpdateComponent } from 'app/view/project/admin/locations/project-location-update.component';

@Component({
  template: '',
})
export class ProjectLocationModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.activatedRoute.data.subscribe(({ project, location }) => {
      this.modalRef = this.modalService.open(ProjectLocationUpdateComponent, {
        beforeDismiss(): boolean {
          window.history.back();
          return true;
        },
      });
      (this.modalRef.componentInstance as ProjectLocationUpdateComponent).updateForm(project, location ? location : {});
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
