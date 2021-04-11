export interface IUser {
  id?: string;
  login?: string;
  email?: string;
}

export class User implements IUser {
  constructor(public id: string, public login: string, public email: string) {}
}
