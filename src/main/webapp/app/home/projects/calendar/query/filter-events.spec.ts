import { CalendarEvent } from 'angular-calendar';

import { CalendarMetaModel } from '../event-to-calendar-event';

import { filterEvents } from './filter-events';

describe('filter Events', () => {
  const events: CalendarEvent<CalendarMetaModel>[] = [
    { id: 1, start: new Date(), end: new Date(), title: 'Happy Event', meta: { location: { id: 1, name: 'Bern' } } },
    { id: 2, start: new Date(), end: new Date(), title: 'Sad Event', meta: { location: { id: 2, name: 'Zurich' } } },
    { id: 3, start: new Date(), end: new Date(), title: 'Neutral Event', meta: { location: { id: 3, name: 'Bern' } } },
  ];

  describe('by title', () => {
    describe('containing', () => {
      it('should filter events containing "Happy"', () => {
        const query = 'title CONTAINS "Happy"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents).toEqual([events[0]]);
      });

      it('should filter events containing "NEUTRAL"', () => {
        const query = 'title CONTAINS "NEUTRAL"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents).toEqual([events[2]]);
      });

      it('should not return non-matching "something"', () => {
        const query = 'title CONTAINS "something"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents.length).toBe(0);
      });
    });

    describe('equal', () => {
      it('should filter events EQUALS "happy event"', () => {
        const query = 'title EQUALS "happy event"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents).toEqual([events[0]]);
      });

      it('should filter events containing "NEUTRAL EVENT"', () => {
        const query = 'title EQUALS "NEUTRAL EVENT"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents).toEqual([events[2]]);
      });

      it('should not return non-matching "something"', () => {
        const query = 'title EQUALS "something"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents.length).toBe(0);
      });
    });
  });

  describe('by location name', () => {
    describe('containing', () => {
      it('should filter events by location equal to "er"', () => {
        const query = 'location CONTAINS "er"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents).toEqual([events[0], events[2]]);
      });

      it('should filter events by location equal to "UR"', () => {
        const query = 'location CONTAINS "UR"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents).toEqual([events[1]]);
      });

      it('should not return non-matching "something"', () => {
        const query = 'location CONTAINS "something"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents.length).toBe(0);
      });
    });

    describe('equals', () => {
      it('should filter events by location equal to "bern"', () => {
        const query = 'location EQUALS "bern"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents).toEqual([events[0], events[2]]);
      });

      it('should filter events by location equal to "ZURICH"', () => {
        const query = 'location EQUALS "ZURICH"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents).toEqual([events[1]]);
      });

      it('should not return non-matching "something"', () => {
        const query = 'location EQUALS "something"';
        const filteredEvents = filterEvents(events, query);
        expect(filteredEvents.length).toBe(0);
      });
    });
  });

  it('should filter events with AND condition', () => {
    const query = 'title CONTAINS "Event" AND location EQUALS "Bern"';
    const filteredEvents = filterEvents(events, query);
    expect(filteredEvents.length).toBe(2);
    expect(filteredEvents).toEqual([events[0], events[2]]);
  });

  it('should filter events with OR condition', () => {
    const query = 'title CONTAINS "Happy" OR location EQUALS "Zurich"';
    const filteredEvents = filterEvents(events, query);
    expect(filteredEvents.length).toBe(2);
    expect(filteredEvents).toEqual([events[0], events[1]]);
  });
});
