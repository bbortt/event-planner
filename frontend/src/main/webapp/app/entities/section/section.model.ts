import { Event } from 'app/entities/event/event.model';
import { Location } from 'app/entities/location/location.model';
import { Responsibility } from 'app/entities/responsibility/responsibility.model';
import { Account } from 'app/core/auth/account.model';

export interface Section {
  id?: number;
  name: string;
  location: Location;
  events?: Event[];
  responsibility?: Responsibility;
  user?: Account;
}
