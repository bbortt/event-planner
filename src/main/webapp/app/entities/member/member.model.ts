import dayjs from 'dayjs/esm';
import { IProject } from 'app/entities/project/project.model';

export interface IMember {
  id: number;
  accepted?: boolean | null;
  acceptedBy?: string | null;
  acceptedDate?: dayjs.Dayjs | null;
  member_of?: Pick<IProject, 'id' | 'name'> | null;
}

export type NewMember = Omit<IMember, 'id'> & { id: null };
