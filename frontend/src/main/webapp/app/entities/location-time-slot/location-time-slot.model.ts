import { Location } from 'app/entities/location/location.model';

import { Moment } from 'moment';

export interface LocationTimeSlot {
  id?: number;
  startTime: Moment;
  endTime: Moment;
  location: Location;
}
