// @flow
import * as React from 'react';

import { NextComponentType } from 'next';

import { wrapper } from '../redux/store';

export type reduxWrapperPropTypes = {
  children: React.ChildrenArray<React.Element<any>>,
};

export const ReduxWrapper = ({ children }: reduxWrapperPropTypes): React.Element<'div'> => {
  return <div>{children}</div>;
};

export default (wrapper.withRedux(ReduxWrapper): typeof NextComponentType);
