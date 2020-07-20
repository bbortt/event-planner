import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IResponsibility } from 'app/shared/model/responsibility.model';

@Component({
  selector: 'jhi-responsibility-detail',
  templateUrl: './responsibility-detail.component.html',
})
export class ResponsibilityDetailComponent implements OnInit {
  responsibility: IResponsibility | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ responsibility }) => (this.responsibility = responsibility));
  }

  previousState(): void {
    window.history.back();
  }
}
