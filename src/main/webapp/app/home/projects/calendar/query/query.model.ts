export type Operator = 'CONTAINS' | 'EQUALS';

export interface Query {
  field: string;
  operator: Operator;
  value: string;
}
