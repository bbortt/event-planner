import { Location, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';

import { IMember } from '../member.model';

@Component({
  standalone: true,
  selector: 'jhi-member-detail',
  templateUrl: './member-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, NgIf],
})
export default class MemberDetailComponent {
  @Input() member: IMember | null = null;

  constructor(private location: Location) {}

  previousState(): void {
    this.location.back();
  }
}
