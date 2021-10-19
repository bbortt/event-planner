// @flow
import * as React from 'react';

export type safeHydratePropTypes = {
  children?: React.ChildrenArray<React.Element<any>>,
};

export const SafeHydrate = ({ children }: safeHydratePropTypes): React.Element<'div'> => {
  return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>;
};

export default SafeHydrate;
