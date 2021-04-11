import { Account } from 'app/core/auth/account.model';

import { Moment } from 'moment';

export interface ICreateProject {
  name: string;
  description?: string;
  startTime: Moment;
  endTime: Moment;
  userInformation?: Account;
}
