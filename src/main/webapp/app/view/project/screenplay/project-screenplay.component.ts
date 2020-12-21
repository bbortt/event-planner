import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import { faCog } from '@fortawesome/free-solid-svg-icons';

import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';

import { LocationService } from 'app/entities/location/location.service';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

const ROUTE_PARAM_NAME = 'activeLocations';

@Component({
  selector: 'app-screenplay',
  templateUrl: './project-screenplay.component.html',
  styleUrls: ['project-screenplay.component.scss'],
})
export class ProjectScreenplayComponent implements OnInit {
  faCog = faCog;

  project?: Project;
  locations?: Location[];

  activeLocations: string[] = [];

  constructor(private locationService: LocationService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;

      this.locationService
        .findAllByProject(project, {
          unpaged: true,
        })
        .subscribe((response: HttpResponse<Location[]>) => {
          this.locations = response.body || [];
        });
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let activeIds = params[ROUTE_PARAM_NAME];
      if (activeIds) {
        activeIds = JSON.parse(activeIds);
        if (!(activeIds instanceof Array)) {
          activeIds = [activeIds];
        }
        this.activeLocations = activeIds;
      }
    });
  }

  reset(): void {
    this.activeLocations = [];
    this.pushParams();
  }

  onPanelChange(event: NgbPanelChangeEvent): void {
    const { panelId } = event;

    if (event.nextState) {
      this.activeLocations.push(panelId);
    } else {
      this.activeLocations.splice(this.activeLocations.indexOf(panelId), 1);
    }

    this.pushParams();
  }

  isActiveId(id: string): boolean {
    return this.activeLocations.includes(id);
  }

  private pushParams(): void {
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams: { [ROUTE_PARAM_NAME]: JSON.stringify(this.activeLocations) },
    });
  }
}
