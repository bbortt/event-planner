import { Project } from 'app/shared/model/project.model';
import { Invitation } from 'app/shared/model/invitation.model';
import { Location } from 'app/shared/model/location.model';
import { Event } from 'app/shared/model/event.model';

export interface Responsibility {
  id?: number;
  name: string;
  project: Project;
  invitations?: Invitation[];
  locations?: Location[];
  events?: Event[];
}
