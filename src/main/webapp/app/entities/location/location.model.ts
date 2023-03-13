import dayjs from 'dayjs/esm';
import { IProject } from 'app/entities/project/project.model';

export interface ILocation {
  id: number;
  name?: string | null;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  project?: Pick<IProject, 'id' | 'name'> | null;
  parent?: Pick<ILocation, 'id' | 'name'> | null;
}

export type NewLocation = Omit<ILocation, 'id'> & { id: null };
