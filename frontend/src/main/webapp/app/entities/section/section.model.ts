import { Event } from 'app/entities/event/event.model';
import { Location } from 'app/entities/location/location.model';
import { Responsibility } from 'app/entities/responsibility/responsibility.model';

export interface Section {
  id?: number;
  name: string;
  location: Location;
  events?: Event[];
  responsibility?: Responsibility;
  jhiUserId?: string;
}
