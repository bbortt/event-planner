import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectLocationUpdateComponent } from './project-location-update.component';

@Component({
  selector: 'app-project-location-update-modal',
  template: '',
})
export class ProjectLocationUpdateModalComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef | undefined;

  constructor(private activatedRoute: ActivatedRoute, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.modalRef = this.modalService.open(ProjectLocationUpdateComponent, { size: 'lg' });
    this.modalRef.result.catch(() => window.history.back());

    this.activatedRoute.data.subscribe(({ location, project }) => {
      if (this.modalRef && project) {
        this.modalRef.componentInstance.project = project;

        if (location) {
          this.modalRef.componentInstance.location = location;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
