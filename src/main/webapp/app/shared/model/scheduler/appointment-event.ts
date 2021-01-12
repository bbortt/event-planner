import { ISchedulerEvent } from 'app/shared/model/scheduler/event.scheduler';

export interface AppointmentEvent {
  appointmentData: ISchedulerEvent;
  cancel: boolean;
}
