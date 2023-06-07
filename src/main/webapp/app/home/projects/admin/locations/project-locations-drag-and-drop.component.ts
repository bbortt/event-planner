import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, Subject, Subscription, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { GetProjectLocations200Response, Location, Project, ProjectLocationService } from 'app/api';
import { LocationService } from 'app/entities/location/service/location.service';
import { DragulaService } from 'ng2-dragula';
import { ILocation } from '../../../../entities/location/location.model';

const ACTIVE_LOCATION_PATH_QUERY_PARAM_NAME = 'activeLocationPath';

interface LocationIdAndName {
  id: number;
  name: string;
}

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

  locationSelectedSource = new Subject<Location>();

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
    dragulaService.createGroup(this.locationRootList, {
      moves: this.moveWithHandleOnly,
    });
    dragulaService.createGroup(this.locationChildrenList, {
      moves: this.moveWithHandleOnly,
    });
  }

  ngOnInit(): void {
    this.locationSelectedSource.subscribe((location: Location) => this.setActiveLocation(location));

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
            this.synchronizeActiveLocationPathFromRouter(locationIds);
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

  setActiveLocation(location: LocationIdAndName | null): void {
    this.synchronizeActiveLocationPathToRouter(location && this.locations ? this.findLocationPathById(location.id, this.locations) : []);
  }

  ngOnDestroy(): void {
    if (this.locationUpdatedSource) {
      this.locationUpdatedSource.unsubscribe();
    }
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
    } else if (this.activeLocationPathString) {
      this.synchronizeActiveLocationPathFromRouter(this.activeLocationPathString);
      this.activeLocationPathString = null;
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

  private synchronizeActiveLocationPathFromRouter(activeLocationPath: string): void {
    if (!activeLocationPath) {
      return;
    }

    const resolvedPath = this.findLocationPathById(Number(activeLocationPath.split(',').pop()), this.locations ?? []);

    this.activeLocationPath = resolvedPath.map(location => this.locationIdAndName(location));
    this.activeLocation = resolvedPath[resolvedPath.length - 1];
  }

  private synchronizeActiveLocationPathToRouter(activeLocationPath: LocationIdAndName[]): void {
    this.router
      .navigate([], {
        queryParams: { [ACTIVE_LOCATION_PATH_QUERY_PARAM_NAME]: activeLocationPath.map(location => location.id).join(',') },
      })
      .catch(() => window.location.reload());
  }

  private moveWithHandleOnly(
    el?: Element | undefined,
    container?: Element | undefined,
    handle?: Element | undefined,
    sibling?: Element | undefined
  ): boolean {
    console.log('handle?.className:', handle?.classList);
    return handle?.classList.contains('drag-handle') ?? false;
  }
}
