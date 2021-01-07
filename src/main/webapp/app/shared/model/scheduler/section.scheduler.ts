import { Section } from 'app/shared/model/section.model';

export interface ISchedulerSection {
  id: number;
  text: string;
  color?: string;
}

export class SchedulerSection implements ISchedulerSection {
  id: number;
  text: string;
  color: string;

  constructor(section: Section) {
    this.id = section.id!;
    this.text = section.name!;
    this.color = '#17a2b8';
  }
}
