import dayjs from 'dayjs/esm';

import { Event } from 'app/api';

import eventToCalendarEvent from './event-to-calendar-event';

describe('Event to CalendarEvent', () => {
  it('maps all properties', () => {
    const event: Event = {
      id: 1234,
      name: 'test-event',
      startDateTime: '2023-08-27T08:00',
      endDateTime: '2023-08-27T09:00',
      location: {
        id: 2345,
        name: 'test location',
        children: [],
      },
    };

    const calendarEvent = eventToCalendarEvent(event);

    expect(calendarEvent.id).toEqual(event.id);
    expect(calendarEvent.title).toEqual(event.name);
    expect(calendarEvent.start).toEqual(dayjs(event.startDateTime).toDate());
    expect(calendarEvent.end).toEqual(dayjs(event.endDateTime).toDate());

    expect(calendarEvent.meta).toBeTruthy();
    expect(calendarEvent.meta!.location.id).toEqual(event.location?.id);
    expect(calendarEvent.meta!.location.name).toEqual(event.location?.name);
  });
});
