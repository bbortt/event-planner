import { Location } from './location.model';
import { Event } from './event.model';
import { Responsibility } from './responsibility.model';
import { User } from 'app/core/user/user.model';

export interface Section {
  id?: number;
  name: string;
  location: Location;
  events?: Event[];
  responsibility?: Responsibility;
  user?: User;
}
