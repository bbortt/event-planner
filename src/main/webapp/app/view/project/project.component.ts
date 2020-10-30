import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import { Project } from 'app/shared/model/project.model';
import { ProjectService } from 'app/entities/project/project.service';
import { LocationTimeSlot } from 'app/shared/model/location-time-slot.model';

@Component({
  selector: 'jhi-project',
  templateUrl: './project.component.html',
  styleUrls: ['project.component.scss'],
})
export class ProjectComponent implements OnInit {
  project?: Project;

  constructor(private router: Router, private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectService.find(params.id).subscribe((project: HttpResponse<LocationTimeSlot>) => {
        if (project.body) {
          this.project = project.body;
        } else {
          this.router.navigate(['404']);
        }
      });
    });
  }
}
