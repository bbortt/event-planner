import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProjectAdminUpdateComponent } from 'app/view/project/admin/project-admin-update.component';

@Component({
  template: '',
  styleUrls: ['./project-admin-update-modal.component.scss'],
})
export class ProjectAdminUpdateModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute) {}

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
  }
}
