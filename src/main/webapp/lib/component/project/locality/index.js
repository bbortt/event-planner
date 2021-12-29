// @flow
import * as React from 'react';

import NewLocalityReveal from './new-locality.reveal';

export const Locality = (): React.Element<'div'> => {
  const newLocationRevealId = 'new-location-reveal';

  return (
    <div className="project-locality">
      <div className="top-bar top-bar-bordered site-header">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text">Lokalitäte</li>
          </ul>
        </div>

        <div className="top-bar-right">
          <ul className="menu button-group">
            <li>
              <NewLocalityReveal revealId={newLocationRevealId} />

              <button type="button" className="button success" data-open={newLocationRevealId} aria-label="Neuer Standort erfassen">
                neui Lokalität
              </button>
            </li>
          </ul>{' '}
        </div>
      </div>
    </div>
  );
};

export default Locality;
