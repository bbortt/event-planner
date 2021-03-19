import { SchedulerEvent } from '../dto/scheduler-event.model';

export interface AppointmentEvent {
  appointmentData: SchedulerEvent;
  cancel: boolean;
}
