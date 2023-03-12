import dayjs from 'dayjs/esm';

import { IMember, NewMember } from './member.model';

export const sampleWithRequiredData: IMember = {
  id: 27280,
  accepted: false,
};

export const sampleWithPartialData: IMember = {
  id: 55681,
  accepted: false,
  acceptedBy: 'Re-engineered',
};

export const sampleWithFullData: IMember = {
  id: 24980,
  accepted: true,
  acceptedBy: 'driver',
  acceptedDate: dayjs('2023-03-12T08:24'),
};

export const sampleWithNewData: NewMember = {
  accepted: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
