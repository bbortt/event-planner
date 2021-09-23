// @flow
import * as React from 'react';

export type calloutType = 'primary' | 'secondary' | 'success' | 'warning' | 'alert';

export type calloutPropTypes = {
  type?: calloutType,
  fit?: boolean,
  children: React.ChildrenArray<React.Element<any>>,
};

export const Callout = ({ type = 'secondary', fit = true, children }: calloutPropTypes): React.Element<'div'> => {
  return <div className={`callout ${type}${fit ? ' fit-content' : ''}`}>{children}</div>;
};

export default Callout;
