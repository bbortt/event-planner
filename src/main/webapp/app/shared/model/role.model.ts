export interface IRole {
  name?: string;
}

export class Role implements IRole {
  constructor(public name?: string) {}
}
