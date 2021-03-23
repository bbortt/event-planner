import { Component, Input } from '@angular/core';

import { SchedulerEvent } from 'app/entities/dto/scheduler-event.model';

@Component({
  selector: 'app-scheduler-appointment',
  templateUrl: './scheduler-appointment.component.html',
})
export class SchedulerAppointmentComponent {
  @Input()
  appointment?: SchedulerEvent;
}
