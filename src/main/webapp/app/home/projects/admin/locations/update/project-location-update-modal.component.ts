import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { ActivatedRoute } from '@angular/router';

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

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

    combineLatest([this.activatedRoute.url, this.activatedRoute.data])
      .pipe(
        map(([url, { location, project }]) => ({
          isNew: url.length > 0 && url[url.length - 1].path.endsWith('new'),
          location,
          project,
        }))
      )
      .subscribe(({ isNew, location, project }) => {
        if (this.modalRef && project) {
          this.modalRef.componentInstance.project = project;

          if (isNew && location) {
            this.modalRef.componentInstance.parentLocation = location;
          } else if (location) {
            this.modalRef.componentInstance.existingLocation = location;
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