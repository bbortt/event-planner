import { Event } from 'app/entities/event/event.model';
import { Invitation } from 'app/entities/invitation/invitation.model';
import { Project } from 'app/entities/project/project.model';

export interface Responsibility {
  id?: number;
  name: string;
  color?: string;
  project: Project;
  invitations?: Invitation[];
  locations?: Location[];
  events?: Event[];
}
