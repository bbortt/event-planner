import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, tap } from 'rxjs';

import { GetProjectLocations200Response, Location, Project, ProjectLocationService } from 'app/api';
import { LocationService } from 'app/entities/location/service/location.service';

@Component({
  selector: 'app-project-locations',
  templateUrl: './project-locations.component.html',
  styleUrls: ['./project-locations.component.scss'],
})
export class ProjectLocationsComponent implements OnDestroy, OnInit {
  project: Project | null = null;

  locations?: Location[];
  isLoading = false;

  activeLocation: Location | null = null;

  private locationUpdatedSource: Subscription | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService,
    private projectLocationService: ProjectLocationService
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
  }

  ngOnDestroy(): void {
    if (this.locationUpdatedSource) {
      this.locationUpdatedSource.unsubscribe();
    }
  }

  setActiveLocation(location: Location): void {
    this.activeLocation = location;
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
}
