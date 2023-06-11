import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILocation } from '../location.model';

@Component({
  selector: 'jhi-location-detail',
  templateUrl: './location-detail.component.html',
})
export class LocationDetailComponent implements OnInit {
  location: ILocation | null = null;

  constructor(private activatedRoute: ActivatedRoute, private angularLocation: Location) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.location = location;
    });
  }

  previousState(): void {
    this.angularLocation.back();
  }
}
