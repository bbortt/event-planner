import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ILocation, Location } from 'app/shared/model/location.model';
import { LocationService } from './location.service';
import { IProject } from 'app/shared/model/project.model';
import { ProjectService } from 'app/entities/project/project.service';
import { IResponsibility } from 'app/shared/model/responsibility.model';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

type SelectableEntity = IProject | IResponsibility;

@Component({
  selector: 'jhi-location-update',
  templateUrl: './location-update.component.html',
})
export class LocationUpdateComponent implements OnInit {
  isSaving = false;
  projects: IProject[] = [];
  responsibilities: IResponsibility[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    dateFrom: [],
    dateTo: [],
    project: [null, Validators.required],
    responsibility: [],
  });

  constructor(
    protected locationService: LocationService,
    protected projectService: ProjectService,
    protected responsibilityService: ResponsibilityService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      if (!location.id) {
        const today = moment().startOf('day');
        location.dateFrom = today;
        location.dateTo = today;
      }

      this.updateForm(location);

      this.projectService.query().subscribe((res: HttpResponse<IProject[]>) => (this.projects = res.body || []));

      this.responsibilityService.query().subscribe((res: HttpResponse<IResponsibility[]>) => (this.responsibilities = res.body || []));
    });
  }

  updateForm(location: ILocation): void {
    this.editForm.patchValue({
      id: location.id,
      name: location.name,
      dateFrom: location.dateFrom ? location.dateFrom.format(DATE_TIME_FORMAT) : null,
      dateTo: location.dateTo ? location.dateTo.format(DATE_TIME_FORMAT) : null,
      project: location.project,
      responsibility: location.responsibility,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  private createFromForm(): ILocation {
    return {
      ...new Location(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      dateFrom: this.editForm.get(['dateFrom'])!.value ? moment(this.editForm.get(['dateFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      dateTo: this.editForm.get(['dateTo'])!.value ? moment(this.editForm.get(['dateTo'])!.value, DATE_TIME_FORMAT) : undefined,
      project: this.editForm.get(['project'])!.value,
      responsibility: this.editForm.get(['responsibility'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
