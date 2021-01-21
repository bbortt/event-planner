import { User } from 'app/core/user/user.model';
import { Responsibility } from 'app/shared/model/responsibility.model';

export interface ISchedulerResponsibility {
  id: number;
  text: string;
  isResponsibility: boolean;
  color: string;
  originalValue: Responsibility | User;
}

export class SchedulerResponsibility implements ISchedulerResponsibility {
  id: number;
  text = '';
  isResponsibility: boolean;
  color: string;
  originalValue: Responsibility | User;

  constructor(value: Responsibility | User, isResponsibility: boolean) {
    this.id = value.id;

    if (isResponsibility && 'name' in value) {
      this.text = value.name;
    } else if ('email' in value) {
      this.text = value.email;
    }

    this.isResponsibility = isResponsibility;

    if (this.isResponsibility && 'color' in value && value.color) {
      this.color = value.color;
    } else {
      this.color = '#17a2b8';
    }

    this.originalValue = value;
  }
}
