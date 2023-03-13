import dayjs from 'dayjs/esm';

import { ILocation, NewLocation } from './location.model';

export const sampleWithRequiredData: ILocation = {
  id: 91847,
  name: 'parsing',
};

export const sampleWithPartialData: ILocation = {
  id: 128,
  name: 'monetize indigo',
  description: 'International Computer',
  createdDate: dayjs('2023-03-13T13:11'),
  lastModifiedBy: 'Internal',
  lastModifiedDate: dayjs('2023-03-13T16:08'),
};

export const sampleWithFullData: ILocation = {
  id: 41809,
  name: 'Checking',
  description: 'redundant Plastic panel',
  createdBy: 'architect',
  createdDate: dayjs('2023-03-13T11:11'),
  lastModifiedBy: 'bypass',
  lastModifiedDate: dayjs('2023-03-13T08:38'),
};

export const sampleWithNewData: NewLocation = {
  name: 'Curve Identity',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
