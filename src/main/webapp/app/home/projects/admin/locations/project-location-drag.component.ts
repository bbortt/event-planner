import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { filter, Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Location, Project } from 'app/api';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

import LocationDeleteDialogComponent from 'app/entities/location/delete/location-delete-dialog.component';

import SharedModule from 'app/shared/shared.module';

import { LocationControl } from './project-locations-drag-and-drop.component';

@Component({
  standalone: true,
  selector: 'app-project-location-drag',
  templateUrl: './project-location-drag.component.html',
  imports: [SharedModule, RouterModule],
})
export default class ProjectLocationDragComponent implements OnInit {
  @Input() location: Location | null = null;
  @Input() project: Project | null = null;

  @Input() locationSelected: Subject<LocationControl> | null = null;

  openLocationText: string | null = null;
  editLocationText: string | null = null;
  deleteLocationText: string | null = null;
  dragLocationText: string | null = null;

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.translateService
      .get([
        'app.project.admin.location.drag',
        'app.project.admin.location.delete',
        'app.project.admin.location.edit',
        'app.project.admin.location.open',
      ])
      .subscribe(result => {
        this.openLocationText = result['app.project.admin.location.open'];
        this.editLocationText = result['app.project.admin.location.edit'];
        this.deleteLocationText = result['app.project.admin.location.delete'];
        this.dragLocationText = result['app.project.admin.location.drag'];
      });
  }

  protected selectLocation(): void {
    this.locationSelected?.next({ type: 'select', location: this.location! });
  }

  protected delete(): void {
    const modalRef = this.modalService.open(LocationDeleteDialogComponent, { size: 'lg' });
    modalRef.componentInstance.location = this.location;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.pipe(filter(reason => reason === ITEM_DELETED_EVENT)).subscribe({
      next: () => {
        this.locationSelected?.next({ type: 'delete', location: this.location! });
      },
    });
  }
}
