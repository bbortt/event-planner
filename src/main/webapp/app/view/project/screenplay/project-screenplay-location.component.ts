import { Component, Input, OnInit } from '@angular/core';

import { Location } from 'app/shared/model/location.model';
import { Section } from 'app/shared/model/section.model';

import { LocationService } from 'app/entities/location/location.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-project-screenplay-location',
  templateUrl: './project-screenplay-location.component.html',
})
export class ProjectScreenplayLocationComponent implements OnInit {
  @Input()
  location?: Location;

  sections: Section[] = [];

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.locationService.findAllSections(this.location!).subscribe((response: HttpResponse<Section[]>) => {
      this.sections = response.body || [];
    });
  }
}
