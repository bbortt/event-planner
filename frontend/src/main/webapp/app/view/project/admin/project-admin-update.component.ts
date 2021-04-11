import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ProjectService } from 'app/entities/project/project.service';

import { Project } from 'app/entities/project/project.model';

import { ProjectConfirmationDialogComponent } from 'app/view/project/admin/project-confirmation-dialog.component';

import { faArchive } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-project-update',
  templateUrl: './project-admin-update.component.html',
  styleUrls: ['./project-admin-update.component.scss'],
})
export class ProjectAdminUpdateComponent {
  faArchive = faArchive;

  project?: Project;
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    description: [null, [Validators.minLength(1), Validators.maxLength(300)]],
    startTime: [],
    endTime: [],
    archived: [false],
  });

  constructor(
    private router: Router,
    protected projectService: ProjectService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private eventManager: EventManager,
    private fb: FormBuilder
  ) {}

  updateForm(project: Project): void {
    this.project = project;
    this.editForm.patchValue({
      id: project.id,
      name: project.name,
      description: project.description,
      startTime: project.startTime,
      endTime: project.endTime,
      archived: project.archived,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.createFromForm();
    this.subscribeToSaveResponse(this.projectService.update(project));
  }

  archive(): void {
    const modalRef = this.modalService.open(ProjectConfirmationDialogComponent);
    modalRef.componentInstance.archive = true;
    modalRef.componentInstance.project = this.project;
    modalRef.result
      .then((result: boolean) => {
        if (result) {
          this.router.navigate(['']).then(() =>
            this.alertService.addAlert({
              type: 'success',
              translationKey: 'eventPlannerApp.project.archived',
              translationParams: { param: this.project!.name },
            })
          );
        }
      })
      .catch(() =>
        this.alertService.addAlert({
          type: 'warning',
          translationKey: 'global.error.internalServerError',
          translationParams: { param: this.project!.name },
        })
      );
  }

  delete(): void {
    const modalRef = this.modalService.open(ProjectConfirmationDialogComponent);
    modalRef.componentInstance.delete = true;
    modalRef.componentInstance.project = this.project;
    modalRef.result
      .then((result: boolean) => {
        if (result) {
          this.router.navigate(['']).then(() =>
            this.alertService.addAlert({
              type: 'success',
              translationKey: 'eventPlannerApp.project.deleted',
              translationParams: { param: this.project!.name },
            })
          );
        }
      })
      .catch(() =>
        this.alertService.addAlert({
          type: 'warning',
          translationKey: 'global.error.internalServerError',
          translationParams: { param: this.project!.name },
        })
      );
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Project>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.eventManager.broadcast('projectDataModification');
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  private createFromForm(): Project {
    return {
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value || null,
      startTime: this.editForm.get(['startTime'])!.value,
      endTime: this.editForm.get(['endTime'])!.value,
      archived: this.editForm.get(['archived'])!.value,
    };
  }
}
