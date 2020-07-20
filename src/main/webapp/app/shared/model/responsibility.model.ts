export interface IResponsibility {
  id?: number;
  name?: string;
}

export class Responsibility implements IResponsibility {
  constructor(public id?: number, public name?: string) {}
}
