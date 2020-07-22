import { IProject } from 'app/shared/model/project.model';

export interface IResponsibility {
  id?: number;
  name?: string;
  project?: IProject;
}

export class Responsibility implements IResponsibility {
  constructor(public id?: number, public name?: string, public project?: IProject) {}
}
