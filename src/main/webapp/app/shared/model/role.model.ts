export interface IRole {
  id?: number;
  name?: string;
}

export class Role implements IRole {
  constructor(public id?: number, public name?: string) {}
}
