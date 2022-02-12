// @flow
import * as React from 'react';

import { useDrag, useDrop } from 'react-dnd';

import styles from './locality.drag.module.scss';

export const LOCALITY_DROP_TYPE = 'locality-drop';

export type localityDragPropTypes = {
  locality: Locality,
  onLocalitySelect: (locality: Locality) => void,
};

export const LocalityDrag = ({ locality, onLocalitySelect }: localityDragPropTypes): React.Element<'div'> => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: LOCALITY_DROP_TYPE,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: { ...locality },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult && item.id !== dropResult.id) {
        console.log(`You dropped ${item} into ${dropResult}!`);
      }
    },
  }));
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: LOCALITY_DROP_TYPE,
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
    drop: () => locality,
  }));

  return (
    <div
      className={`locality-drag hoverable ${styles.localityDrag} ${!isDragging && canDrop ? styles.localityDragTarget : ''} ${
        !isDragging && isOver ? styles.localityDragActive : ''
      }`}
      ref={drop}
      role={'Dustbin'}
    >
      <div ref={dragPreview} style={{ opacity: isDragging ? 0.7 : 1 }}>
        <div className="grid-x" ref={drag} role="Handle">
          <div className="cell small-6 grid-y align-center">
            <span>Lokalität "{locality.name}"</span>
          </div>
          <div className="cell small-6 text-right">
            <button
              type="button"
              className={`button primary ${styles.buttonNoMargin}`}
              onClick={() => onLocalitySelect(locality)}
              aria-label={`Lokalität "${locality.name}" auswählen`}
            >
              Meh gseh &#187;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalityDrag;
