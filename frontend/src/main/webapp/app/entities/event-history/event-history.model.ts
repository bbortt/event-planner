import { EventHistoryAction } from './event-history-action';

import { Responsibility } from 'app/entities/responsibility/responsibility.model';

import { Dayjs } from 'dayjs';

export interface EventHistory {
  id?: number;
  eventId: number;
  projectId: number;
  action: EventHistoryAction;
  name: string;
  description?: string;
  startTime: Dayjs;
  endTime: Dayjs;
  sectionId: number;
  responsibilityId?: Responsibility;
  jhiUserId?: number;
  createdBy: string;
  createdDate: Dayjs;
}
