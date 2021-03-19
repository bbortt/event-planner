import { Project } from './project.model';
import { Invitation } from './invitation.model';
import { Location } from './location.model';
import { Event } from './event.model';

export interface Responsibility {
  id?: number;
  name: string;
  color?: string;
  project: Project;
  invitations?: Invitation[];
  locations?: Location[];
  events?: Event[];
}
