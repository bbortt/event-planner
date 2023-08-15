import dayjs from 'dayjs/esm';
import { ILocation } from 'app/entities/location/location.model';

export interface IEvent {
  id: number;
  name?: string | null;
  startDateTime?: dayjs.Dayjs | null;
  endDateTime?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  location?: Pick<ILocation, 'id' | 'name'> | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
