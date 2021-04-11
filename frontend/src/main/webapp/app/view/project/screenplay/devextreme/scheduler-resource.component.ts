import { Component, Input } from '@angular/core';

import { SchedulerSection } from 'app/entities/dto/scheduler-section.model';

@Component({
  selector: 'app-scheduler-resource',
  templateUrl: './scheduler-resource.component.html',
  styleUrls: ['./scheduler-resource.component.scss'],
})
export class SchedulerResourceComponent {
  @Input()
  resource?: SchedulerSection;
}
