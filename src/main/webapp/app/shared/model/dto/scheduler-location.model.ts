import { SchedulerSection } from 'app/shared/model/dto/scheduler-section.model';
import { SchedulerColorGroup } from 'app/shared/model/dto/scheduler-color-group.model';

export interface SchedulerLocation {
  sections: SchedulerSection[];
  colorGroups: SchedulerColorGroup[];
}
