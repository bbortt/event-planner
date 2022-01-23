// @flow
import * as React from 'react';

import { useDrag } from 'react-dnd';

import styles from './locality.drag.module.scss';

export type localityDragPropTypes = {
  locality: Locality,
};

export const LocalityDrag = ({ locality }: localityDragPropTypes): React.Element<'div'> => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: 'BOX',
    // The collect function utilizes a "monitor" instance (see the Overview for what this is)
    // to pull important pieces of state from the DnD system.
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1 }} className={`locality-drag ${styles.localityDrag}`}>
      <div role="Handle" ref={drag} />
    </div>
  );
};

export default LocalityDrag;
