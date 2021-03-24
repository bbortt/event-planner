import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import { combineLatest, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { LocationService } from 'app/entities/location/location.service';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Location } from 'app/entities/location/location.model';
import { Project } from 'app/entities/project/project.model';

import { faChevronDown, faChevronUp, faCog } from '@fortawesome/free-solid-svg-icons';

import { Role } from 'app/config/role.constants';

const ROUTE_ACTIVE_LOCATIONS_PARAM_NAME = 'activeLocations';

@Component({
  selector: 'app-screenplay',
  templateUrl: './project-screenplay.component.html',
  styleUrls: ['./project-screenplay.component.scss'],
})
export class ProjectScreenplayComponent implements OnInit {
  faCog = faCog;
  chevronDown = faChevronDown;
  chevronUp = faChevronUp;

  adminRoles = [Role.ADMIN.name, Role.SECRETARY.name];

  project?: Project;
  locations?: Location[];

  activeLocations: string[] = [];
  allExpanded = new EventEmitter<boolean>();

  constructor(
    private locationService: LocationService,
    private responsibilityService: ResponsibilityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap])
      .pipe(
        tap((value: [Data, ParamMap]) => (this.project = value[0].project as Project)),
        switchMap((value: [Data, ParamMap]) =>
          combineLatest([
            this.locationService.findAllByProject(value[0].project, { sort: ['name,asc'] }),
            of(value[1].get(ROUTE_ACTIVE_LOCATIONS_PARAM_NAME) as string),
          ])
        ),
        map((value: [HttpResponse<Location[]>, string]) => ({
          locations: value[0].body ?? [],
          activeIds: value[1],
        })),
        take(1)
      )
      .subscribe(({ locations, activeIds }: { locations: Location[]; activeIds: string }) => {
        this.locations = locations;

        let newActiveIds: any = activeIds;
        if (newActiveIds) {
          newActiveIds = JSON.parse(newActiveIds);
          if (!(newActiveIds instanceof Array)) {
            newActiveIds = [newActiveIds];
          }
          this.activeLocations = newActiveIds;
        }

        this.afterActiveLocationsChange();
      });
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
}
