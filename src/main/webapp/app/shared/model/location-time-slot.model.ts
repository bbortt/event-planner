import { Moment } from 'moment';
import { Location } from 'app/shared/model/location.model';

export interface LocationTimeSlot {
  id?: number;
  startTime: Moment;
  endTime: Moment;
  location: Location;
}
