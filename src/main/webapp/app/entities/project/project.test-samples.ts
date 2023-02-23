import dayjs from 'dayjs/esm';

import { IProject, NewProject } from './project.model';

export const sampleWithRequiredData: IProject = {
  id: 55962,
  token: 'fd8b446f-e9a1-48c6-88cf-9e36358a8070',
  name: 'Response Investor Loan',
  startDate: dayjs('2023-02-23T05:18'),
  endDate: dayjs('2023-02-23T15:06'),
  archived: true,
};

export const sampleWithPartialData: IProject = {
  id: 77377,
  token: '8af8c66b-3823-4a8e-ad04-3a096fbfce8d',
  name: 'Product Berkshire Cotton',
  description: 'fresh-thinking Granite EXE',
  startDate: dayjs('2023-02-23T07:10'),
  endDate: dayjs('2023-02-23T10:26'),
  archived: true,
  createdDate: dayjs('2023-02-23T06:02'),
};

export const sampleWithFullData: IProject = {
  id: 96317,
  token: 'af6c4d9c-362d-4048-a7e0-9f9203bc1ed8',
  name: 'Wooden SCSI',
  description: 'Cheese',
  startDate: dayjs('2023-02-23T12:33'),
  endDate: dayjs('2023-02-22T19:13'),
  archived: false,
  createdBy: 'Cotton Specialist',
  createdDate: dayjs('2023-02-22T20:50'),
  lastModifiedBy: 'customized web',
  lastModifiedDate: dayjs('2023-02-22T22:36'),
};

export const sampleWithNewData: NewProject = {
  token: '0eb7769e-28e0-4872-aafd-09fb60b702b8',
  name: 'Officer',
  startDate: dayjs('2023-02-23T15:50'),
  endDate: dayjs('2023-02-23T05:13'),
  archived: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
