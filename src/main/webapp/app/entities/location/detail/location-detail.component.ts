import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';

import { ILocation } from '../location.model';

@Component({
  standalone: true,
  selector: 'jhi-location-detail',
  templateUrl: './location-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export default class LocationDetailComponent {
  @Input() location: ILocation | null = null;

  constructor(private angularLocation: Location) {}

  previousState(): void {
    this.angularLocation.back();
  }
}
