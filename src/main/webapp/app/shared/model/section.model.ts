import { Location } from 'app/shared/model/location.model';
import { Event } from 'app/shared/model/event.model';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { User } from 'app/core/user/user.model';

export interface Section {
  id?: number;
  name?: string;
  location: Location;
  events?: Event[];
  responsibility?: Responsibility;
  user?: User;
}
