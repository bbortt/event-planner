import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 63022,
  name: 'Cotton',
};

export const sampleWithPartialData: IEvent = {
  id: 20540,
  name: 'object-oriented',
  createdBy: 'Metal teal',
};

export const sampleWithFullData: IEvent = {
  id: 68263,
  name: 'Account',
  createdBy: 'Personal deposit sky',
  createdDate: dayjs('2023-03-12T22:07'),
  lastModifiedBy: 'bus',
  lastModifiedDate: dayjs('2023-03-12T21:26'),
};

export const sampleWithNewData: NewEvent = {
  name: 'generation fuchsia',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
