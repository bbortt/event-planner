import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProjectSectionUpdateComponent } from 'app/view/project/admin/locations/sections/project-section-update.component';

@Component({
  template: '',
})
export class ProjectSectionModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.activatedRoute.data.subscribe(({ location, section }) => {
      this.modalRef = this.modalService.open(ProjectSectionUpdateComponent, {
        beforeDismiss(): boolean {
          window.history.back();
          return true;
        },
      });

      (this.modalRef.componentInstance as ProjectSectionUpdateComponent).updateForm(location ? location : {}, section ? section : {});
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
