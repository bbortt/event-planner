import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IResponsibility, Responsibility } from 'app/shared/model/responsibility.model';
import { ResponsibilityService } from './responsibility.service';

@Component({
  selector: 'jhi-responsibility-update',
  templateUrl: './responsibility-update.component.html',
})
export class ResponsibilityUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
  });

  constructor(protected responsibilityService: ResponsibilityService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ responsibility }) => {
      this.updateForm(responsibility);
    });
  }

  updateForm(responsibility: IResponsibility): void {
    this.editForm.patchValue({
      id: responsibility.id,
      name: responsibility.name,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const responsibility = this.createFromForm();
    if (responsibility.id !== undefined) {
      this.subscribeToSaveResponse(this.responsibilityService.update(responsibility));
    } else {
      this.subscribeToSaveResponse(this.responsibilityService.create(responsibility));
    }
  }

  private createFromForm(): IResponsibility {
    return {
      ...new Responsibility(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResponsibility>>): void {
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
}
