// @flow
import * as React from 'react';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export type dndProviderPropTypes = {
  children?: React.ChildrenArray<React.Element<any>>,
};

export const BackendAwareDndProvider = ({ children }: dndProviderPropTypes): React.Element<'div'> => {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
};

export default BackendAwareDndProvider;
