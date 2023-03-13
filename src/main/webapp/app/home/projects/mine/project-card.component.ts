import { Component, Input } from '@angular/core';

import { IProject } from '../../../entities/project/project.model';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
})
export class ProjectCardComponent {
  @Input() project?: IProject;
}
