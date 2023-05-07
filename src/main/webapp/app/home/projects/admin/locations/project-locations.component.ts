import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from '../../../../api';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-locations',
  templateUrl: './project-locations.component.html',
})
export class ProjectLocationsComponent implements OnDestroy, OnInit {
  project: Project | null = null;

  constructor(private activatedRoute: ActivatedRoute) {}

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
  }

  ngOnDestroy(): void {}

  private load() {}
}
