import { User } from 'app/core/user/user.model';
import { Responsibility } from 'app/shared/model/responsibility.model';

export interface ISchedulerResponsibility {
  id: number;
  text: string;
  isResponsibility: boolean;
  originalValue: Responsibility | User;
}

export class SchedulerResponsibility implements ISchedulerResponsibility {
  id: number;
  text = '';
  isResponsibility: boolean;
  originalValue: Responsibility | User;

  constructor(value: Responsibility | User, isResponsibility: boolean) {
    this.id = value.id;

    if (isResponsibility && 'name' in value) {
      this.text = value.name;
    } else if ('email' in value) {
      this.text = value.email;
    }

    this.isResponsibility = isResponsibility;
    this.originalValue = value;
  }
}
