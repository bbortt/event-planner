import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { faCog } from '@fortawesome/free-solid-svg-icons';

import { Project } from 'app/shared/model/project.model';

import { LocationService } from 'app/entities/location/location.service';
import { Location } from 'app/shared/model/location.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-screenplay',
  templateUrl: './screenplay.component.html',
  styleUrls: ['screenplay.component.scss'],
})
export class ScreenplayComponent implements OnInit {
  faCog = faCog;

  project?: Project;
  locations?: Location[];

  constructor(private locationService: LocationService, private activatedRoute: ActivatedRoute) {}

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
  }
}
