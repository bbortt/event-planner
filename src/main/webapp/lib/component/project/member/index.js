// @flow
import * as React from 'react';

export type membersPropTypes = {
  project: Project,
};

export const Members = ({ project }: membersPropTypes): React.Element<'div'> => {
  return (
    <div className="project-members">
      <div className="top-bar top-bar-bordered site-header">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text">Mitglider</li>
          </ul>
        </div>

        <div className="top-bar-right">
          <ul className="menu button-group">
            {/*<li>*/}
            {/*    <NewLocalityReveal revealId={newLocationRevealId} />*/}

            {/*    <button type="button" className="button primary" data-open={newLocationRevealId} aria-label="Neuer Standort erfassen">*/}
            {/*        neui Lokalität*/}
            {/*    </button>*/}
            {/*</li>*/}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Members;
