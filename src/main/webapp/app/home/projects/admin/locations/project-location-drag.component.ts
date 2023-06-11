import { Component, Input, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { Location, Project } from 'app/api';

@Component({
  selector: 'app-project-location-drag',
  templateUrl: './project-location-drag.component.html',
})
export class ProjectLocationDragComponent implements OnInit {
  @Input() location: Location | null = null;
  @Input() project: Project | null = null;

  @Input() locationSelected: Subject<Location> | null = null;

  openLocationText: string | null = null;
  editLocationText: string | null = null;
  dragLocationText: string | null = null;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService
      .get(['app.project.admin.location.drag', 'app.project.admin.location.edit', 'app.project.admin.location.open'])
      .subscribe(result => {
        this.openLocationText = result['app.project.admin.location.open'];
        this.editLocationText = result['app.project.admin.location.edit'];
        this.dragLocationText = result['app.project.admin.location.drag'];
      });
  }

  selectLocation(): void {
    this.locationSelected?.next(this.location!);
  }
}
