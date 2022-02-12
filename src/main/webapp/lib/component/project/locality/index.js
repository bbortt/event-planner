// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { localitiesLoad } from '../../../redux/action/locality.action';
import { localitiesSelector } from '../../../redux/selector/locality.selector';

import MessageList from '../../../container/message-list';
import BackendAwareDndProvider from '../../../wrapper/dnd-provider';

import LocalityDrop from './locality.drop';
import NewLocalityReveal from './new-locality.reveal';

import styles from './locality.module.scss';

const ROOT_LOCALITY_NAME = 'Mami';

export type localitiesPropTypes = {
  project: Project,
};

export const Localities = ({ project }: localitiesPropTypes): React.Element<'div'> => {
  const [newLocalityParent, setNewLocalityParent] = useState();
  const [time] = useState(new Date().getTime());

  const [localityIdIndices, setLocalityIdIndices] = useState([]);

  const dispatch = useDispatch();
  const projectLocalities = useSelector(localitiesSelector(project));

  console.log('projectLocalities: ', projectLocalities);

  useEffect(() => {
    try {
      // $FlowFixMe
      jQuery(`#${newLocalityRevealId}`).foundation('open');
    } catch (e) {
      // Silently ignored
    }
  }, [newLocalityParent]);

  useEffect(() => dispatch(localitiesLoad(project)), [dispatch]);

  const newLocalityRevealId = `new-locality-reveal-${time}`;

  const addLocality = parent => setNewLocalityParent(parent.name === ROOT_LOCALITY_NAME ? null : parent);
  const localitySelected = (selectedLocality: Locality) => {
    dispatch(localitiesLoad(project, selectedLocality));
    setLocalityIdIndices(buildLocalityIdIndices(localityIdIndices, selectedLocality));
  };

  const renderLocalitiesThroughIndices = () => {
    const alreadyResolved = [];
    return localityIdIndices.map((localityIndex, index) => {
      alreadyResolved.push(localityIndex);

      const localityAtIndex = resolveLocalityUsingIdIndices(projectLocalities, alreadyResolved);
      console.log('localityAtIndex: ', localityAtIndex);
      return (
        <div className={`cell medium-4 ${styles.localityDrop}`} key={index}>
          <LocalityDrop
            locality={localityAtIndex}
            childrenLocalities={localityAtIndex.children || []}
            addLocality={addLocality}
            onLocalitySelect={localitySelected}
          />
        </div>
      );
    });
  };

  return (
    <div className="project-localities">
      <NewLocalityReveal parentLocality={newLocalityParent} revealId={newLocalityRevealId} />

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
              locality={{ name: ROOT_LOCALITY_NAME, project }}
              childrenLocalities={projectLocalities}
              addLocality={addLocality}
              onLocalitySelect={localitySelected}
            />
          </div>

          {renderLocalitiesThroughIndices()}
        </BackendAwareDndProvider>
      </div>
    </div>
  );
};

const buildLocalityIdIndices = (currentIndices: number[], newLocality: Locality): number[] => {
  // TODO: This is not that simple.. look out for parent!
  const nextIndices = currentIndices.slice();
  nextIndices.push(Number(newLocality.id));
  return nextIndices;
};

const resolveLocalityUsingIdIndices = (projectLocalities: Locality[], localityIndices: number[]): Locality => {
  const locality = projectLocalities.find(projectLocality => Number(projectLocality.id) === localityIndices[0]);

  if (localityIndices.length === 1) {
    return locality;
  }

  return resolveLocalityUsingIdIndices(locality.children, localityIndices.slice(1, localityIndices.length));
};

export default Localities;
