import dayjs from 'dayjs/esm';

import { AuditingEntity } from '../common/auditing-entity.model';

export interface IProject extends AuditingEntity {
  id: number;
  token?: string | null;
  name?: string | null;
  description?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  archived?: boolean | null;
}

export type NewProject = Omit<IProject, 'id'> & { id: null };
