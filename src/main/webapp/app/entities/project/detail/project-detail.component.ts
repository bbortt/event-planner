import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';

import { IProject } from '../project.model';

@Component({
  standalone: true,
  selector: 'jhi-project-detail',
  templateUrl: './project-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export default class ProjectDetailComponent {
  @Input() project: IProject | null = null;

  constructor(private location: Location) {}

  previousState(): void {
    this.location.back();
  }
}
