import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { JhiEventManager } from 'ng-jhipster';

import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { ProjectService } from 'app/entities/project/project.service';
import { AccountService } from 'app/core/auth/account.service';
import { ICreateProject } from 'app/shared/model/dto/create-project.model';

import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';

import * as moment from 'moment';
import { DEFAULT_DEBOUNCE } from 'app/app.constants';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
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

  filteredUsers: User[] = [];
  defaultDebounce = DEFAULT_DEBOUNCE;

  private destroy$ = new Subject();

  constructor(
    private projectService: ProjectService,
    private accountService: AccountService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private eventManager: JhiEventManager
  ) {
    this.accountService.identity().subscribe(() => {
      if (this.accountService.hasAnyAuthority(AUTHORITY_ADMIN)) {
        this.editForm.get(['selectedUser'])!.setValidators(Validators.required);
      }
    });
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

  filterUsersByLoginOrEmail(value: string): void {
    if (!value) {
      this.initalLoad();
      return;
    }

    this.userService.findByEmailOrLogin(value).subscribe((users: User[]) => (this.filteredUsers = users));
  }

  initalLoad(): void {
    this.userService
      .query({
        page: 0,
        size: 5,
        sort: ['login,asc', 'email,asc'],
      })
      .subscribe((res: HttpResponse<User[]>) => (this.filteredUsers = res.body || []));
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
        this.eventManager.broadcast('myProjectsListModification');
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
}
