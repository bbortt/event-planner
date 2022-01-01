// @flow
import * as React from 'react';

import styles from './callout.module.scss';

export type calloutType = '' | 'primary' | 'secondary' | 'success' | 'warning' | 'alert';

export type calloutPropTypes = {
  type?: calloutType,
  fit?: boolean,
  children: React.ChildrenArray<React.Element<any>>,
};

export const Callout = ({ type = 'secondary', fit = true, children }: calloutPropTypes): React.Element<'div'> => {
  return <div className={`callout ${type} ${fit ? styles.fitContent : 'width-100'}`}>{children}</div>;
};

export default Callout;
