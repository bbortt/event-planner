import { CalendarEvent } from 'angular-calendar';

import { CalendarMetaModel } from '../event-to-calendar-event';

import { Operator, Query } from './query.model';

const parseQuery = (query: string): Query[][] => {
  // Splitting queries based on AND and OR
  const orQueries = query.split(/ OR /i);
  return orQueries.map(orQuery => {
    const andQueries = orQuery.split(/ AND /i);
    return andQueries.map(andQuery => {
      // Splitting only once at the first space and last space
      const field = andQuery.slice(0, andQuery.indexOf(' ')).toLowerCase();

      const operatorIndex = andQuery.indexOf(' ') + 1;
      const operator = andQuery.slice(operatorIndex, andQuery.indexOf(' ', operatorIndex)).toUpperCase() as Operator;

      const value = andQuery.slice(operatorIndex + operator.length + 1).replace(/['"]+/g, ''); // Remove quotes

      return {
        field,
        operator,
        value,
      };
    });
  });
};

const checkEventAgainstQuery = (event: CalendarEvent<CalendarMetaModel>, query: Query): boolean => {
  const { field, operator, value } = query;
  switch (field) {
    case 'title':
      switch (operator) {
        case 'CONTAINS':
          return event.title.toLowerCase().includes(value.toLowerCase());
        case 'EQUALS':
          return event.title.toLowerCase() === value.toLowerCase();
      }
      break;
    case 'location':
      switch (operator) {
        case 'CONTAINS':
          return event.meta?.location.name.toLowerCase().includes(value.toLowerCase()) ?? false;
        case 'EQUALS':
          return event.meta?.location.name.toLowerCase() === value.toLowerCase();
      }
      break;
  }
  return false;
};

export const filterEvents = (events: CalendarEvent<CalendarMetaModel>[], queryString: string): CalendarEvent<CalendarMetaModel>[] => {
  const queries = parseQuery(queryString);
  return events.filter(event => queries.some(orQuery => orQuery.every(andQuery => checkEventAgainstQuery(event, andQuery))));
};
