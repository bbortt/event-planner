// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { localitiesLoad } from '../../redux/action/locality.action';
import { localitiesSelector } from '../../redux/selector/locality.selector';

import { ROOT_LOCALITY_NAME } from '../../constants';

import MessageList from '../message-list';

import LocalityDropList from '../../component/project/locality/locality-drop-list';
import NewLocalityReveal from '../../component/project/locality/new-locality.reveal';

export type projectLocalitiesPropTypes = {
  project: Project,
};

export const ProjectLocalities = ({ project }: projectLocalitiesPropTypes): React.Element<'div'> => {
  const [newLocalityParent, setNewLocalityParent] = useState();
  const [time] = useState(new Date().getTime());

  const dispatch = useDispatch();
  const projectLocalities = useSelector(localitiesSelector(project));

  const [localityIdIndices, setLocalityIdIndices] = useState([]);

  useEffect(() => {
    try {
      // $FlowFixMe
      jQuery(`#${newLocalityRevealId}`).foundation('open');
    } catch (e) {
      // Silently ignored
    }
  }, [newLocalityParent]);

  useEffect(() => {
    dispatch(localitiesLoad(project));
  }, [dispatch]);

  const newLocalityRevealId = `new-locality-reveal`;

  const addLocality = parent => setNewLocalityParent(parent.name === ROOT_LOCALITY_NAME ? { id: 0 } : parent);
  const localitySelected = (selectedLocality: Locality) => {
    dispatch(localitiesLoad(project, selectedLocality));
    setLocalityIdIndices(buildLocalityIdIndices(localityIdIndices, selectedLocality));
  };

  return (
    <div className="project-localities">
      <NewLocalityReveal parentLocality={newLocalityParent.id != 0 && newLocalityParent} revealId={newLocalityRevealId} />

      <div className="top-bar top-bar-bordered site-header">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text">Lokalitäte</li>
          </ul>
        </div>
      </div>

      <MessageList />

      <LocalityDropList
        addLocality={addLocality}
        localityIdIndices={localityIdIndices}
        onLocalitySelect={localitySelected}
        project={project}
        projectLocalities={projectLocalities}
      />
    </div>
  );
};

const buildLocalityIdIndices = (currentIdIndices: string[], newLocality: Locality): string[] => {
  if (!newLocality.parent) {
    return [newLocality.id];
  }

  let nextIndices;
  const matchIndex = currentIdIndices.findIndex(id => newLocality.parent && id === newLocality.parent.id);
  if (matchIndex !== -1) {
    nextIndices = currentIdIndices.slice(0, matchIndex + 1);
  } else {
    nextIndices = currentIdIndices.slice();
  }

  nextIndices.push(newLocality.id);

  return nextIndices;
};

export default ProjectLocalities;
