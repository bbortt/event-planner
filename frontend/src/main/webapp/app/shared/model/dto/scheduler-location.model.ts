import { SchedulerSection } from './scheduler-section.model';
import { SchedulerColorGroup } from './scheduler-color-group.model';
import { SchedulerEvent } from './scheduler-event.model';

export interface SchedulerLocation {
  events: SchedulerEvent[];
  sections: SchedulerSection[];
  colorGroups: SchedulerColorGroup[];
}
