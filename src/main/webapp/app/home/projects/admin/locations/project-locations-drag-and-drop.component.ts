import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, Subject, Subscription, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { DragulaService } from 'ng2-dragula';

import { GetProjectLocations200Response, Location, Project, ProjectLocationService } from 'app/api';
import { LocationService } from 'app/entities/location/service/location.service';

const ACTIVE_LOCATION_PATH_QUERY_PARAM_NAME = 'activeLocationPath';

type LocationIdAndName = {
  id: number;
  name: string;
};

export type LocationControl = {
  type: 'select' | 'delete';
  location?: Location | LocationIdAndName;
};

@Component({
  selector: 'app-project-locations',
  templateUrl: './project-locations-drag-and-drop.component.html',
  styleUrls: ['./project-locations-drag-and-drop.component.scss'],
})
export class ProjectLocationsDragAndDropComponent implements OnDestroy, OnInit {
  locationRootList = 'location-root-list';
  locationChildrenList = 'location-children-list';

  project: Project | null = null;

  locations?: Location[];
  isLoading = false;

  locationControlSource = new Subject<LocationControl>();

  activeLocation: Location | null = null;
  activeLocationPath: LocationIdAndName[] = [];

  createNewLocationWithParentText = '';

  private activeLocationPathString: string | null = null;
  private locationUpdatedSource: Subscription | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    private locationService: LocationService,
    private projectLocationService: ProjectLocationService,
    private router: Router,
    private translateService: TranslateService
  ) {
    dragulaService.destroy(this.locationRootList);
    dragulaService.createGroup(this.locationRootList, {
      moves: this.moveWithHandleOnly,
    });
    dragulaService.destroy(this.locationChildrenList);
    dragulaService.createGroup(this.locationChildrenList, {
      moves: this.moveWithHandleOnly,
    });
  }

  ngOnInit(): void {
    this.locationControlSource.subscribe((location: LocationControl) => this.handleLocationControl(location));

    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap])
      .pipe(
        map(([{ project }, queryParams]) => ({ locationIds: queryParams.get(ACTIVE_LOCATION_PATH_QUERY_PARAM_NAME), project })),
        tap(({ project }) => {
          if (project) {
            this.project = project;
          }
        }),
        tap(({ locationIds }) => {
          if (locationIds) {
            this.synchronizeActiveLocationPathStringFromRouter(locationIds);
            this.activeLocationPathString = locationIds;
          }
        })
      )
      .subscribe(() => this.load());

    this.locationUpdatedSource = this.locationService.locationUpdatedSource$.subscribe(() => this.load());

    this.translateService
      .get('app.project.admin.location.addChild')
      .subscribe((translation: string) => (this.createNewLocationWithParentText = translation));
  }

  ngOnDestroy(): void {
    if (this.locationUpdatedSource) {
      this.locationUpdatedSource.unsubscribe();
    }
  }

  handleLocationControl(control: LocationControl): void {
    switch (control.type) {
      case 'delete':
        this.load();
        break;
      case 'select':
      default:
        this.setActiveLocation(control.location ?? null);
    }
  }

  private setActiveLocation(location: Location | LocationIdAndName | null): void {
    this.activeLocation = location as Location;
    this.synchronizeActiveLocationPathToRouter(location && this.locations ? this.findLocationPathById(location.id, this.locations) : []);
  }

  private load(): void {
    this.projectLocationService
      .getProjectLocations(this.project!.id!, 'response')
      .pipe(tap(() => (this.isLoading = false)))
      .subscribe({
        next: (res: HttpResponse<GetProjectLocations200Response>) => {
          this.onResponseSuccess(res);
        },
      });
  }

  private onResponseSuccess(response: HttpResponse<GetProjectLocations200Response>): void {
    this.locations = this.fillComponentAttributesFromResponseBody(response.body?.contents);

    if (this.activeLocation) {
      this.setActiveLocation(this.activeLocation);
      this.synchronizeActiveLocationPathFromRouter(this.activeLocation.id);
    } else if (this.activeLocationPathString) {
      this.synchronizeActiveLocationPathStringFromRouter(this.activeLocationPathString);
      this.activeLocationPathString = null;
    } else {
      this.setActiveLocation(null);
    }
  }

  private fillComponentAttributesFromResponseBody(data: Array<Location> | undefined): Location[] {
    return data ?? [];
  }

  private findLocationPathById(locationId: number, nextLocations: Location[]): Location[] {
    for (const location of nextLocations) {
      if (location.id === locationId) {
        return [location];
      }

      const childLocations = this.findLocationPathById(locationId, location.children);
      if (childLocations.length > 0) {
        return [location, ...childLocations];
      }
    }

    return [];
  }

  private locationIdAndName(location: Location): LocationIdAndName {
    return { id: location.id, name: location.name };
  }

  private synchronizeActiveLocationPathStringFromRouter(locationIds: string): void {
    this.synchronizeActiveLocationPathFromRouter(Number(locationIds.split(',').pop()));
  }

  private synchronizeActiveLocationPathFromRouter(activeLocationId: number): void {
    const resolvedPath = this.findLocationPathById(activeLocationId, this.locations ?? []);
    this.activeLocationPath = resolvedPath.map(location => this.locationIdAndName(location));
    this.activeLocation = resolvedPath[resolvedPath.length - 1];
  }

  private synchronizeActiveLocationPathToRouter(activeLocationPath: LocationIdAndName[]): void {
    this.router
      .navigate([], {
        queryParams: { [ACTIVE_LOCATION_PATH_QUERY_PARAM_NAME]: activeLocationPath.map(location => location.id).join(',') },
      })
      .catch(() => this.load());
  }

  private moveWithHandleOnly(el?: Element | undefined, container?: Element | undefined, handle?: Element | undefined): boolean {
    return handle?.classList.contains('drag-handle') ?? false;
  }
}
