import { SchedulerEvent } from 'app/shared/model/dto/scheduler-event.model';

export interface AppointmentEvent {
  appointmentData: SchedulerEvent;
  cancel: boolean;
}
