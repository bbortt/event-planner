import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import { combineLatest, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { LocationService } from 'app/entities/location/location.service';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';

import { ISchedulerResponsibility, SchedulerResponsibility } from 'app/shared/model/scheduler/responsibility.scheduler';

import { faChevronDown, faChevronUp, faCog } from '@fortawesome/free-solid-svg-icons';

import { ADMIN, SECRETARY } from 'app/shared/constants/role.constants';
import { DEFAULT_SCHEDULER_CELL_DURATION, DEFAULT_SCHEDULER_RESPONSIBILITY_ID } from 'app/app.constants';

const ROUTE_ACTIVE_LOCATIONS_PARAM_NAME = 'activeLocations';

@Component({
  selector: 'app-screenplay',
  templateUrl: './project-screenplay.component.html',
  styleUrls: ['project-screenplay.component.scss'],
})
export class ProjectScreenplayComponent implements OnInit {
  faCog = faCog;
  chevronDown = faChevronDown;
  chevronUp = faChevronUp;

  adminRoles = [ADMIN.name, SECRETARY.name];

  project?: Project;
  locations?: Location[];

  responsibilities: ISchedulerResponsibility[] = [
    { id: DEFAULT_SCHEDULER_RESPONSIBILITY_ID, color: '#17a2b8' } as ISchedulerResponsibility,
  ];

  activeLocations: string[] = [];
  allExpanded = new EventEmitter<boolean>();

  cellDuration = DEFAULT_SCHEDULER_CELL_DURATION;

  constructor(
    private locationService: LocationService,
    private responsibilityService: ResponsibilityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap])
      .pipe(
        switchMap((value: [Data, ParamMap]) =>
          combineLatest([
            this.locationService.findAllByProject(value[0].project, { sort: ['name,asc'] }),
            this.responsibilityService.findAllByProject(value[0].project, { sort: ['name,asc'] }),
            of(value[1].get(ROUTE_ACTIVE_LOCATIONS_PARAM_NAME) as string),
          ])
        ),
        map((value: [HttpResponse<Location[]>, HttpResponse<Responsibility[]>, string]) => ({
          locations: value[0].body || [],
          responsibilities: value[1].body || [],
          activeIds: value[2],
        })),
        take(1)
      )
      .subscribe(
        ({ locations, responsibilities, activeIds }: { locations: Location[]; responsibilities: Responsibility[]; activeIds: string }) => {
          this.locations = locations;
          this.responsibilities.push(
            ...responsibilities.map((responsibility: Responsibility) => new SchedulerResponsibility(responsibility, true))
          );
          let newActiveIds: any = activeIds;
          if (newActiveIds) {
            newActiveIds = JSON.parse(newActiveIds);
            if (!(newActiveIds instanceof Array)) {
              newActiveIds = [newActiveIds];
            }
            this.activeLocations = newActiveIds;
          }

          this.afterActiveLocationsChange();
        }
      );
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
      queryParams: { [ROUTE_ACTIVE_LOCATIONS_PARAM_NAME]: JSON.stringify(this.activeLocations) },
      queryParamsHandling: 'merge',
    });
  }

  onCellDurationChange(cellDuration: number): void {
    this.cellDuration = cellDuration;
  }
}
