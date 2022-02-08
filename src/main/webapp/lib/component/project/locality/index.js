// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { localitiesLoad } from '../../../redux/action/locality.action';
import { localitiesSelector } from '../../../redux/selector/locality.selector';

import BackendAwareDndProvider from '../../../wrapper/dnd-provider';
import MessageList from '../../../container/message-list';
import LocalityDrop from './locality.drop';
import LocalityDrag from './locality.drag';

import styles from './locality.module.scss';
import NewLocalityReveal from './new-locality.reveal';

export type localitiesPropTypes = {
  project: Project,
};

export const Localities = ({ project }: localitiesPropTypes): React.Element<'div'> => {
  const [time] = useState(new Date().getTime());

  const rootLocalities = useSelector(localitiesSelector(project, null));
  const dispatch = useDispatch();

  useEffect(() => dispatch(localitiesLoad(project)), [dispatch]);

  let selectedLocalities = [];

  const newLocationRevealId = `new-location-reveal-${time}`;

  const addLocality = () => {
    // $FlowFixMe
    jQuery(`#${newLocationRevealId}`).foundation('open');
  };

  return (
    <div className="project-localities">
      <NewLocalityReveal revealId={newLocationRevealId} />

      <div className="top-bar top-bar-bordered site-header">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text">Lokalitäte</li>
          </ul>
        </div>
      </div>

      <MessageList />

      <div className="grid-x grid-padding-x">
        <BackendAwareDndProvider>
          <div className={`cell medium-4 ${styles.localityDrop}`}>
            <LocalityDrop addLocality={addLocality} childrenLocalities={rootLocalities} locality={{ name: 'Mami' }} />
          </div>
        </BackendAwareDndProvider>
      </div>
    </div>
  );
};

export default Localities;
