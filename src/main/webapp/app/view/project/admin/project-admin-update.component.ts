import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { ProjectService } from 'app/entities/project/project.service';

import { Project } from 'app/shared/model/project.model';

import { ProjectConfirmationDialogComponent } from 'app/view/project/admin/project-confirmation-dialog.component';

import { faArchive } from '@fortawesome/free-solid-svg-icons';

import { ADMIN } from 'app/shared/constants/role.constants';

@Component({
  selector: 'app-project-update',
  templateUrl: './project-admin-update.component.html',
  styleUrls: ['./project-admin-update.component.scss'],
})
export class ProjectAdminUpdateComponent {
  faArchive = faArchive;
  roleAdmin = ADMIN.name;

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
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private fb: FormBuilder
  ) {}

  public updateForm(project: Project): void {
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
          this.router
            .navigate([''])
            .then(() => this.alertService.success('eventPlannerApp.project.archived', { param: this.project!.name }));
        }
      })
      .catch(() => {});
  }

  delete(): void {
    const modalRef = this.modalService.open(ProjectConfirmationDialogComponent);
    modalRef.componentInstance.delete = true;
    modalRef.componentInstance.project = this.project;
    modalRef.result
      .then((result: boolean) => {
        if (result) {
          this.router
            .navigate([''])
            .then(() => this.alertService.success('eventPlannerApp.project.deleted', { param: this.project!.name }));
        }
      })
      .catch(() => {});
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
}
