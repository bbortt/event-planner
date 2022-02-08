// @flow
import * as React from 'react';

import { useDrop } from 'react-dnd';

import Callout from '../../../foundation/callout';

import LocalityDrag, { LOCALITY_DROP_TYPE } from './locality.drag';

import styles from './locality.drop.module.scss';

export type localityDropPropTypes = {
  addLocality: () => void,
  locality: Locality,
  childrenLocalities: Locality[],
};

export const LocalityDrop = ({ addLocality, locality, childrenLocalities }: localityDropPropTypes): React.Element<'div'> => {
  const [{ canDrop, isOverCurrent }, drop] = useDrop(() => ({
    accept: LOCALITY_DROP_TYPE,
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
    drop: () => locality,
  }));

  const localitySelected = (locality: Locality) => {
    console.log('selectedLocality: ', locality);
  };

  return (
    <div className="locality-drop">
      <div
        className={`${styles.localityDrop} ${canDrop ? styles.localityDropTarget : ''} ${isOverCurrent ? styles.localityDropActive : ''}`}
        ref={drop}
        role={'Dustbin'}
      >
        <p className={styles.localityName}>{locality.name}</p>

        {childrenLocalities.length === 0 && (
          <Callout
            type="warning"
            className={childrenLocalities.length === 0 ? 'hoverable' : ''}
            onClick={childrenLocalities.length === 0 ? addLocality : () => {}}
          >
            <h5>Uf derä Stufä gits no kenner Lokalitäte.</h5>
            <p>Klick hie zum die ersti Lokalität hinzuezfüegä!</p>
          </Callout>
        )}

        <div>
          {childrenLocalities.map((locality: Locality, index: number) => (
            <LocalityDrag key={index} locality={locality} onClick={localitySelected} />
          ))}
        </div>

        <br />

        <button type="button" className="button success" onClick={addLocality} aria-label="Weitere Lokalität hinzufügen">
          Lokalität derzuefüege
        </button>
      </div>
    </div>
  );
};

export default LocalityDrop;
