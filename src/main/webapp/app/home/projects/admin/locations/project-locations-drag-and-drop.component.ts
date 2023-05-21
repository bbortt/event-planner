import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, tap } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { GetProjectLocations200Response, Location, Project, ProjectLocationService } from 'app/api';
import { LocationService } from 'app/entities/location/service/location.service';

@Component({
  selector: 'app-project-locations',
  templateUrl: './project-locations-drag-and-drop.component.html',
  styleUrls: ['./project-locations-drag-and-drop.component.scss'],
})
export class ProjectLocationsDragAndDropComponent implements OnDestroy, OnInit {
  project: Project | null = null;

  locations?: Location[];
  isLoading = false;

  activeLocation: Location | null = null;
  activeLocationPath: Location[] = [];

  createNewLocationWithParentText = '';

  private locationUpdatedSource: Subscription | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService,
    private projectLocationService: ProjectLocationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        tap(({ project }) => {
          if (project) {
            this.project = project;
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

  setActiveLocation(location: Location | null): void {
    this.activeLocation = location;
    this.activeLocationPath = location && this.locations ? this.findLocationPathById(location.id, this.locations) : [];
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
}
