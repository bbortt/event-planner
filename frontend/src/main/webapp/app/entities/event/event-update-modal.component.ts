import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest } from 'rxjs';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { EventUpdateComponent } from 'app/entities/event/event-update.component';

import * as dayjs from 'dayjs';

@Component({
  template: '',
})
export class EventUpdateModalComponent implements OnInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    combineLatest([this.activatedRoute.queryParams, this.activatedRoute.data, this.activatedRoute.url]).subscribe(
      ([queryParams, data, url]) => {
        let { event } = data;
        const { section, project } = data;

        if (!event) {
          event = { section };
          if (!event.section) {
            event = { section: { location: { project } } };
          }
        }

        let startTime = queryParams.startTime;
        startTime = startTime ? dayjs(startTime).toDate() : event.startTime;
        let endTime = queryParams.endTime;
        endTime = endTime ? dayjs(endTime).toDate() : event.endTime;

        const lastSegment = url[url.length - 1].path;
        const isReadonly = lastSegment !== 'new' && lastSegment !== 'edit';

        this.modalRef = this.modalService.open(EventUpdateComponent, {
          beforeDismiss(): boolean {
            window.history.back();
            return true;
          },
        });

        (this.modalRef.componentInstance as EventUpdateComponent).updateForm(
          event,
          startTime || project.startTime || new Date(),
          endTime || project.endTime || new Date(),
          isReadonly
        );
      }
    );
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
