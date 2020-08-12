import { ILocation } from 'app/shared/model/location.model';
import { IEvent } from 'app/shared/model/event.model';

export interface ISection {
  id?: number;
  name?: string;
  location?: ILocation;
  events?: IEvent[];
}

export class Section implements ISection {
  constructor(public id?: number, public name?: string, public location?: ILocation, public events?: IEvent[]) {}
}
