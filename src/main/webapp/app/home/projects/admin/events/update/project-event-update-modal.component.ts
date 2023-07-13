import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectEventUpdateComponent } from './project-event-update.component';

@Component({
  selector: 'app-project-location-update-modal',
  template: '',
})
export class ProjectEventUpdateModalComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.modalRef = this.modalService.open(ProjectEventUpdateComponent, { size: 'lg' });
    this.modalRef.result.catch(() => this.location.back());

    this.activatedRoute.data.subscribe(({ event }) => {
      if (this.modalRef) {
        if (event) {
          this.modalRef.componentInstance.event = event;
          this.modalRef.componentInstance.updateForm(event);
        }

        this.modalRef.componentInstance.loadRelationshipsOptions();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
