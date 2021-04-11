import { SchedulerColorGroup } from 'app/entities/dto/scheduler-color-group.model';
import { SchedulerEvent } from 'app/entities/dto/scheduler-event.model';
import { SchedulerSection } from 'app/entities/dto/scheduler-section.model';

export interface SchedulerLocation {
  events: SchedulerEvent[];
  sections: SchedulerSection[];
  colorGroups: SchedulerColorGroup[];
}
