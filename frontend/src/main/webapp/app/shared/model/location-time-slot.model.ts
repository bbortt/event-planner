import { Moment } from 'moment';
import { Location } from './location.model';

export interface LocationTimeSlot {
  id?: number;
  startTime: Moment;
  endTime: Moment;
  location: Location;
}
