import { CalendarEvent } from 'angular-calendar';

import dayjs from 'dayjs/esm';

import { Event } from 'app/api';

export type CalendarMetaModel = {
  location: { id: number; name: string };
};

export const eventToCalendarEvent = (event: Event): CalendarEvent<CalendarMetaModel> => ({
  id: event.id,
  title: event.name,
  start: dayjs(event.startDateTime).toDate(),
  end: dayjs(event.endDateTime).toDate(),
  meta: {
    location: {
      id: event.location!.id,
      name: event.location!.name,
    },
  },
});

export default eventToCalendarEvent;
