import { Component, Input } from '@angular/core';
import { ISchedulerEvent } from 'app/shared/model/scheduler/event.scheduler';

@Component({
  selector: 'app-scheduler-appointment-details',
  templateUrl: './scheduler-appointment-details.component.html',
  styleUrls: ['./scheduler-appointment-details.component.scss'],
})
export class SchedulerAppointmentDetailsComponent {
  @Input()
  appointment?: ISchedulerEvent;
}
