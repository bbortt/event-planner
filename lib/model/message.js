// @flow
import type { calloutType } from '../foundation/callout';

export type Message = {
  +id: number,
  +title?: string,
  +message: string,
  +type: calloutType,
};
