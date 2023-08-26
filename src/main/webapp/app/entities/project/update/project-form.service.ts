import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';

import { IProject, NewProject } from '../project.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProject for edit and NewProjectFormGroupInput for create.
 */
type ProjectFormGroupInput = IProject | PartialWithRequiredKeyOf<NewProject>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IProject | NewProject> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type ProjectFormRawValue = FormValueOf<IProject>;

type NewProjectFormRawValue = FormValueOf<NewProject>;

type ProjectFormDefaults = Pick<NewProject, 'id' | 'startDate' | 'endDate' | 'archived'>;

type ProjectFormGroupContent = {
  id: FormControl<ProjectFormRawValue['id'] | NewProject['id']>;
  token: FormControl<ProjectFormRawValue['token']>;
  name: FormControl<ProjectFormRawValue['name']>;
  description: FormControl<ProjectFormRawValue['description']>;
  startDate: FormControl<ProjectFormRawValue['startDate']>;
  endDate: FormControl<ProjectFormRawValue['endDate']>;
  archived: FormControl<ProjectFormRawValue['archived']>;
  createdBy: FormControl<ProjectFormRawValue['createdBy']>;
  createdDate: FormControl<ProjectFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ProjectFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ProjectFormRawValue['lastModifiedDate']>;
};

export type ProjectFormGroup = FormGroup<ProjectFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProjectFormService {
  createProjectFormGroup(project: ProjectFormGroupInput = { id: null }): ProjectFormGroup {
    const projectRawValue = this.convertProjectToProjectRawValue({
      ...this.getFormDefaults(),
      ...project,
    });
    return new FormGroup<ProjectFormGroupContent>({
      id: new FormControl(
        { value: projectRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      token: new FormControl(projectRawValue.token, {
        validators: [],
      }),
      name: new FormControl(projectRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(63)],
      }),
      description: new FormControl(projectRawValue.description, {
        validators: [Validators.maxLength(255)],
      }),
      startDate: new FormControl(projectRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(projectRawValue.endDate, {
        validators: [Validators.required],
      }),
      archived: new FormControl(projectRawValue.archived ?? false, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(projectRawValue.createdBy),
      createdDate: new FormControl(projectRawValue.createdDate),
      lastModifiedBy: new FormControl(projectRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(projectRawValue.lastModifiedDate),
    });
  }

  getProject(form: ProjectFormGroup): IProject | NewProject {
    return this.convertProjectRawValueToProject(form.getRawValue() as ProjectFormRawValue | NewProjectFormRawValue);
  }

  resetForm(form: ProjectFormGroup, project: ProjectFormGroupInput): void {
    const projectRawValue = this.convertProjectToProjectRawValue({ ...this.getFormDefaults(), ...project });
    form.reset(
      {
        ...projectRawValue,
        id: { value: projectRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProjectFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
      archived: false,
    };
  }

  private convertProjectRawValueToProject(rawProject: ProjectFormRawValue | NewProjectFormRawValue): IProject | NewProject {
    return {
      ...rawProject,
      startDate: dayjs(rawProject.startDate, DATE_FORMAT),
      endDate: dayjs(rawProject.endDate, DATE_FORMAT),
    };
  }

  private convertProjectToProjectRawValue(
    project: IProject | (Partial<NewProject> & ProjectFormDefaults),
  ): ProjectFormRawValue | PartialWithRequiredKeyOf<NewProjectFormRawValue> {
    return {
      ...project,
      startDate: project.startDate ? project.startDate.format(DATE_FORMAT) : undefined,
      endDate: project.endDate ? project.endDate.format(DATE_FORMAT) : undefined,
    };
  }
}
