import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest } from 'rxjs';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { EventUpdateComponent } from 'app/view/project/screenplay/event/event-update.component';

import * as moment from 'moment';

@Component({
  template: '',
})
export class EventUpdateModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    combineLatest([this.activatedRoute.queryParams, this.activatedRoute.data, this.activatedRoute.url]).subscribe((routeParams: any[]) => {
      const { section, event } = routeParams[1];

      let startTime = routeParams[0].startTime;
      startTime = startTime ? moment(startTime).toDate() : event.startTime;
      let endTime = routeParams[0].endTime;
      endTime = endTime ? moment(endTime).toDate() : event.endTime;

      const url = routeParams[2];
      const lastSegment = url[url.length - 1].path;
      const isReadonly = lastSegment !== 'new' && lastSegment !== 'edit';

      this.modalRef = this.modalService.open(EventUpdateComponent, {
        beforeDismiss(): boolean {
          window.history.back();
          return true;
        },
      });

      (this.modalRef.componentInstance as EventUpdateComponent).updateForm(
        event || { sections: [section] },
        startTime || new Date(),
        endTime || new Date(),
        isReadonly
      );
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
