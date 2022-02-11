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

const ROOT_LOCALITY_NAME = 'Mami';

export type localitiesPropTypes = {
  project: Project,
};

export const Localities = ({ project }: localitiesPropTypes): React.Element<'div'> => {
  const [parentLocality, setParentLocality] = useState();
  const [selectedLocality, setSelectedLocality] = useState();
  const [time] = useState(new Date().getTime());

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      // $FlowFixMe
      jQuery(`#${newLocationRevealId}`).foundation('open');
    } catch (e) {
      // Silently ignored
    }
  }, [parentLocality]);
  useEffect(() => dispatch(localitiesLoad(project, selectedLocality)), [selectedLocality]);

  const rootLocalities = useSelector(localitiesSelector(project, null));
  const subLocalities = useSelector(localitiesSelector(project, selectedLocality));

  const newLocationRevealId = `new-location-reveal-${time}`;

  const addLocality = parent => setParentLocality(parent.name === ROOT_LOCALITY_NAME ? null : parent);
  const localitySelected = (locality: Locality) => setSelectedLocality(locality);

  return (
    <div className="project-localitiesReducer">
      <NewLocalityReveal parentLocality={parentLocality} revealId={newLocationRevealId} />

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
            <LocalityDrop
              locality={{ name: ROOT_LOCALITY_NAME }}
              childrenLocalities={rootLocalities}
              addLocality={addLocality}
              onLocalitySelect={localitySelected}
            />
          </div>

          {selectedLocality && (
            <div className={`cell medium-4 ${styles.localityDrop}`}>
              <LocalityDrop
                locality={selectedLocality}
                childrenLocalities={subLocalities || []}
                addLocality={addLocality}
                onLocalitySelect={localitySelected}
              />
            </div>
          )}
        </BackendAwareDndProvider>
      </div>
    </div>
  );
};

export default Localities;
