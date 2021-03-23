import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {EventManager} from 'app/core/util/event-manager.service';

import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import DataSource from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data/load_options';

import { AccountService } from 'app/core/auth/account.service';
import { ProjectService } from 'app/entities/project/project.service';
import { UserService } from 'app/entities/user/user.service';

import { User } from 'app/entities/user/user.model';

import { ICreateProject } from 'app/entities/dto/create-project.model';

import { Authority } from 'app/config/authority.constants';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import * as moment from 'moment';

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
    selectedUser: [null, [Validators.required]],
    selectedUserAutocomplete: [null],
  });

  dataSource: DataSource;

  startMoment = moment();
  endMoment = moment();
  dateTimeFormat = DATE_TIME_FORMAT;

  authorityAdmin = Authority.ADMIN;

  private destroy$ = new Subject();

  constructor(
    private projectService: ProjectService,
    private accountService: AccountService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private eventManager: EventManager
  ) {
    accountService.identity().subscribe(() => {
      if (accountService.hasAnyAuthority(Authority.ADMIN)) {
        this.editForm.get(['selectedUser'])!.setValidators(Validators.required);
      }
    });

    this.dataSource = new DataSource({
      load(loadOptions: LoadOptions): Promise<User[]> {
        return userService.findByEmailOrLogin(loadOptions.searchValue).toPromise() ;
      },
    });
  }

  ngOnInit(): void {
    this.editForm
      .get('startTime')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((startTime: Date) => (this.endMoment = moment(startTime)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  userSelected($event: any): void {
    this.editForm.get('selectedUser')!.setValue($event.selectedItem);
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

  isValidInput(formControlName: string): boolean {
    return !(
      this.editForm.get(formControlName)!.invalid &&
      (this.editForm.get(formControlName)!.dirty || this.editForm.get(formControlName)!.touched)
    );
  }

  private createFromForm(): ICreateProject {
    const newProject: ICreateProject = {
      name: this.editForm.get(['name'])!.value,
      startTime: moment(this.editForm.get(['startTime'])!.value),
      endTime: moment(this.editForm.get(['endTime'])!.value),
      archived: false,
      description: this.editForm.get(['description'])!.value,
    };

    if (this.accountService.hasAnyAuthority(Authority.ADMIN)) {
      newProject.user = this.editForm.get(['selectedUser'])!.value;
    }

    return newProject ;
  }
}
