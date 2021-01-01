import { Component, Input } from '@angular/core';
import { ISchedulerEvent } from 'app/shared/model/scheduler/event.scheduler';

@Component({
  selector: 'app-scheduler-appointment',
  templateUrl: './scheduler-appointment.component.html',
})
export class SchedulerAppointmentComponent {
  @Input()
  appointment?: ISchedulerEvent;
}
