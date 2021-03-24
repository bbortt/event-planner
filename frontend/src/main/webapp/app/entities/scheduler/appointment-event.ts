import { SchedulerEvent } from 'app/entities/dto/scheduler-event.model';

export interface AppointmentEvent {
  appointmentData: SchedulerEvent;
  cancel: boolean;
}
