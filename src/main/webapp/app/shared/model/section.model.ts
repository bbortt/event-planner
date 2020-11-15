import { Location } from 'app/shared/model/location.model';
import { Event } from 'app/shared/model/event.model';

export interface Section {
  id?: number;
  name?: string;
  location?: Location;
  events?: Event[];
}
