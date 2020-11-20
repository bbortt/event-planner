import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ProjectService } from 'app/entities/project/project.service';
import { User } from 'app/core/user/user.model';
import { AccountService } from 'app/core/auth/account.service';
import { ICreateProject } from 'app/shared/model/dto/create-project.model';

import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';

import { switchMap, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  cancelEnabled = true;

  isSaving = false;
  editForm = this.fb.group({
    name: [null, [Validators.required, Validators.maxLength(50)]],
    description: [null, [Validators.maxLength(300)]],
    startTime: [null, [Validators.required]],
    endTime: [null, [Validators.required]],
    selectedUser: [null, []],
  });

  startMoment = moment();
  endMoment = moment();

  private destroy$ = new Subject();

  constructor(
    private projectService: ProjectService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    if (this.accountService.hasAnyAuthority(AUTHORITY_ADMIN)) {
      this.editForm.get(['selectedUser'])!.setValidators(Validators.required);
    }
  }

  ngOnInit(): void {
    this.editForm.get('startTime')!.valueChanges.subscribe((startTime: moment.Moment) => {
      this.endMoment = startTime;
      this.editForm.get('endTime')!.setValue(startTime);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.createFromForm();
    this.projectService
      .create(project)
      .pipe(
        switchMap(() => this.accountService.identity(true)), // Since we save the role per project on the account we need to refetch the account details after creating a project.
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isSaving = false;
        this.previousState();
      });
  }

  private createFromForm(): ICreateProject {
    const newProject: ICreateProject = {
      name: this.editForm.get(['name'])!.value,
      startTime: this.editForm.get(['startTime'])!.value,
      endTime: this.editForm.get(['endTime'])!.value,
      description: this.editForm.get(['description'])!.value,
    };

    if (this.accountService.hasAnyAuthority(AUTHORITY_ADMIN)) {
      newProject.user = this.editForm.get(['selectedUser'])!.value;
    }

    return newProject;
  }

  userSelected(selectedUser: User): void {
    this.editForm.get(['selectedUser'])!.setValue(selectedUser);
  }
}
