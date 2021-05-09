import { Account } from 'app/core/auth/account.model';

import { Dayjs } from 'dayjs';

export interface ICreateProject {
  name: string;
  description?: string;
  startTime: Dayjs;
  endTime: Dayjs;
  userInformation?: Account;
}
