import { Location } from 'app/entities/location/location.model';

import { Dayjs } from 'dayjs';

export interface LocationTimeSlot {
  id?: number;
  startTime: Dayjs;
  endTime: Dayjs;
  location: Location;
}
