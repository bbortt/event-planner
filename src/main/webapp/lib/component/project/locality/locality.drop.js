// @flow
import * as React from 'react';

import { useDrop } from 'react-dnd';

import Callout from '../../../foundation/callout';

import LocalityDrag, { LOCALITY_DROP_TYPE } from './locality.drag';

import styles from './locality.drop.module.scss';

export type localityDropPropTypes = {
  locality: Locality,
  childrenLocalities: Locality[],
  addLocality: (parent: Locality) => void,
  onLocalitySelect: (locality: Locality) => void,
};

export const LocalityDrop = ({
  addLocality,
  locality,
  childrenLocalities,
  onLocalitySelect,
}: localityDropPropTypes): React.Element<'div'> => {
  const [{ canDrop, isOverCurrent }, drop] = useDrop(() => ({
    accept: LOCALITY_DROP_TYPE,
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
    drop: () => locality,
  }));

  return (
    <div
      className={`locality-drop ${styles.localityDrop} ${canDrop ? styles.localityDropTarget : ''} ${
        isOverCurrent ? styles.localityDropActive : ''
      }`}
      ref={drop}
      role={'Dustbin'}
    >
      <p className={styles.localityName}>{locality.name}</p>

      {childrenLocalities.length === 0 && (
        <div className="hoverable" onClick={() => addLocality(locality)}>
          <Callout type="warning">
            <h5>Uf derä Stufä gits no kenner Lokalitäte.</h5>
            <p>Klick hie zum die ersti Lokalität hinzuezfüegä!</p>
          </Callout>
        </div>
      )}

      <div>
        {childrenLocalities.map((locality: Locality, index: number) => (
          <LocalityDrag key={index} locality={locality} onLocalitySelect={onLocalitySelect} />
        ))}
      </div>

      <br />

      <button type="button" className="button success" onClick={() => addLocality(locality)} aria-label="Weitere Lokalität hinzufügen">
        Lokalität derzuefüege
      </button>
    </div>
  );
};

export default LocalityDrop;
