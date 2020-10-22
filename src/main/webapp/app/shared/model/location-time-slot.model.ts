import { Moment } from 'moment';
import { ILocation } from 'app/shared/model/location.model';

export interface ILocationTimeSlot {
  id?: number;
  startTime?: Moment;
  endTime?: Moment;
  location?: ILocation;
}

export class LocationTimeSlot implements ILocationTimeSlot {
  constructor(public id?: number, public startTime?: Moment, public endTime?: Moment, public location?: ILocation) {}
}
