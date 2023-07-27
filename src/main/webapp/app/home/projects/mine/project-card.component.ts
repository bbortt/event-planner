import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IProject } from 'app/entities/project/project.model';

import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  imports: [SharedModule, RouterModule],
})
export default class ProjectCardComponent {
  @Input() project?: IProject;
}
