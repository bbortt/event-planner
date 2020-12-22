import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { JhiEventManager } from 'ng-jhipster';

import { SectionService } from 'app/entities/section/section.service';

import { Location } from 'app/shared/model/location.model';
import { Section } from 'app/shared/model/section.model';

@Component({
  selector: 'app-section-update',
  templateUrl: './project-section-update.component.html',
  styleUrls: ['./project-section-update.component.scss'],
})
export class ProjectSectionUpdateComponent implements OnInit {
  isSaving = false;
  isNew = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    location: [],
  });

  constructor(protected sectionService: SectionService, private eventManager: JhiEventManager, private fb: FormBuilder) {}

  ngOnInit(): void {}

  public updateForm(location: Location, section: Section): void {
    this.isNew = !section.id;

    this.editForm.patchValue({
      id: section.id,
      name: section.name,
      location,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const section = this.createFromForm();
    if (section.id) {
      this.subscribeToSaveResponse(this.sectionService.update(section));
    } else {
      this.subscribeToSaveResponse(this.sectionService.create(section));
    }
  }

  private createFromForm(): Section {
    return {
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      location: this.editForm.get(['location'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Section>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.eventManager.broadcast('sectionListModification');
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
