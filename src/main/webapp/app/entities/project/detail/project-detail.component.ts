import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProject } from '../project.model';

@Component({
  selector: 'jhi-project-detail',
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent implements OnInit {
  project: IProject | null = null;

  constructor(private activatedRoute: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
    });
  }

  previousState(): void {
    this.location.back();
  }
}
