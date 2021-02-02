import { SchedulerSection } from 'app/shared/model/dto/scheduler-section.model';
import { SchedulerColorGroup } from 'app/shared/model/dto/scheduler-color-group.model';
import { SchedulerEvent } from 'app/shared/model/dto/scheduler-event.model';

export interface SchedulerLocation {
  events: SchedulerEvent[];
  sections: SchedulerSection[];
  colorGroups: SchedulerColorGroup[];
}
