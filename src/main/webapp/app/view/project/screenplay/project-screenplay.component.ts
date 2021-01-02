import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import { Subject } from 'rxjs';

import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';

import { LocationService } from 'app/entities/location/location.service';

import { faCog } from '@fortawesome/free-solid-svg-icons';

import { ADMIN, SECRETARY } from 'app/shared/constants/role.constants';
import { takeUntil } from 'rxjs/operators';

const ROUTE_PARAM_NAME = 'activeLocations';

@Component({
  selector: 'app-screenplay',
  templateUrl: './project-screenplay.component.html',
  styleUrls: ['project-screenplay.component.scss'],
})
export class ProjectScreenplayComponent implements OnInit, OnDestroy {
  faCog = faCog;

  adminRoles = [ADMIN.name, SECRETARY.name];

  project?: Project;
  locations?: Location[];

  activeLocations: string[] = [];
  allExpanded = new EventEmitter<boolean>();

  private destroy$ = new Subject();

  constructor(private locationService: LocationService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe(({ project }) => {
      this.project = project;

      this.locationService.findAllByProject(this.project!, { sort: ['name,asc'] }).subscribe((response: HttpResponse<Location[]>) => {
        this.locations = response.body || [];
        this.afterActiveLocationsChange();
      });
    });

    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      let activeIds = params[ROUTE_PARAM_NAME];
      if (activeIds) {
        activeIds = JSON.parse(activeIds);
        if (!(activeIds instanceof Array)) {
          activeIds = [activeIds];
        }
        this.activeLocations = activeIds;
        this.afterActiveLocationsChange();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reset(): void {
    this.activeLocations = [];
    this.afterActiveLocationsChange();
  }

  onPanelChange(event: NgbPanelChangeEvent): void {
    const { panelId } = event;

    if (event.nextState) {
      this.activeLocations.push(panelId);
    } else {
      this.activeLocations.splice(this.activeLocations.indexOf(panelId), 1);
    }

    this.afterActiveLocationsChange();
  }

  isActiveId(id: string): boolean {
    return this.activeLocations.includes(id);
  }

  onExpandAll(expanded: boolean): void {
    if (expanded) {
      this.activeLocations = this.locations!.map((location: Location) => `location-${location.id!}`);
    } else {
      this.activeLocations = [];
    }

    this.afterActiveLocationsChange();
  }

  private afterActiveLocationsChange(): void {
    // Control screenplay nav buttons
    if (this.activeLocations.length === 0) {
      this.allExpanded.emit(false);
    } else if (this.activeLocations.length === this.locations?.length) {
      this.allExpanded.emit(true);
    }

    // Update route
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams: { [ROUTE_PARAM_NAME]: JSON.stringify(this.activeLocations) },
    });
  }
}
