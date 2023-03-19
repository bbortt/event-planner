import dayjs from 'dayjs/esm';
import { IProject } from 'app/entities/project/project.model';

export interface IMember {
  id: number;
  invitedEmail?: string | null;
  accepted?: boolean | null;
  acceptedBy?: string | null;
  acceptedDate?: dayjs.Dayjs | null;
  project?: Pick<IProject, 'id' | 'name'> | null;
}

export type NewMember = Omit<IMember, 'id'> & { id: null };
