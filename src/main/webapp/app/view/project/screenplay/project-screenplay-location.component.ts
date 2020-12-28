import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { SectionService } from 'app/entities/section/section.service';

import { Location } from 'app/shared/model/location.model';
import { Section } from 'app/shared/model/section.model';

@Component({
  selector: 'app-project-screenplay-location',
  templateUrl: './project-screenplay-location.component.html',
})
export class ProjectScreenplayLocationComponent implements OnInit {
  @Input()
  location?: Location;

  sections: Section[] = [];

  constructor(private sectionService: SectionService) {}

  ngOnInit(): void {
    this.sectionService.findAllByLocation(this.location!, { sort: ['name,asc'] }).subscribe((response: HttpResponse<Section[]>) => {
      this.sections = response.body || [];
    });
  }
}
