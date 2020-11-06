import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Project } from 'app/shared/model/project.model';

@Component({
  selector: 'app-project-admin',
  templateUrl: './project-admin.component.html',
  styleUrls: ['project-admin.component.scss'],
})
export class ProjectAdminComponent implements OnInit {
  project?: Project;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
      if (this.router.isActive(`/project/${(project as Project).id!}/admin`, true)) {
        this.router.navigate(['locations'], { relativeTo: this.activatedRoute.parent });
      }
    });
  }
}
