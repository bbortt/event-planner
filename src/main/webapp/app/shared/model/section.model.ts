import { ILocation } from 'app/shared/model/location.model';

export interface ISection {
  id?: number;
  name?: string;
  location?: ILocation;
}

export class Section implements ISection {
  constructor(public id?: number, public name?: string, public location?: ILocation) {}
}
