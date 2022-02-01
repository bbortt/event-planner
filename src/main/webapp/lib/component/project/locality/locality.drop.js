// @flow
import * as React from 'react';
import { useState } from 'react';

import { useDrop } from 'react-dnd';

import Callout from '../../../foundation/callout';
import NewLocalityReveal from './new-locality.reveal';

import styles from './locality.drop.module.scss';

export type localityDropPropTypes = {
  parentLocality: Locality | null,
};

export const LocalityDrop = ({ parentLocality }: localityDropPropTypes): React.Element<'div'> => {
  const [time] = useState(new Date().getTime());
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: 'BOX',
    // Props to collect
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const newLocationRevealId = `new-location-reveal-${time}`;

  const addLocality = () => {
    // $FlowFixMe
    jQuery(`#${newLocationRevealId}`).foundation('open');
  };

  return (
    <div className="locality-drop">
      <NewLocalityReveal revealId={newLocationRevealId} />

      <div
        ref={drop}
        role={'Dustbin'}
        className={`hoverable ${isOver ? styles.localityDropActive : styles.localityDrop}`}
        onClick={addLocality}
      >
        {(!parentLocality || !parentLocality.localities || parentLocality.localities.length === 0) && (
          <Callout type="warning">
            <h5>Uf derä Stufä gits no kenner Lokalitäte.</h5>
            <p>Klick hie zum die ersti Lokalität hinzuezfüegä!</p>
          </Callout>
        )}

        {canDrop ? 'Release to drop' : 'Drag a box here'}
      </div>
    </div>
  );
};

export default LocalityDrop;
