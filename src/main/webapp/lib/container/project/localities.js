// @flow
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { localitiesLoad } from '../../redux/action/locality.action';
import { localitiesSelector } from '../../redux/selector/locality.selector';

import { ROOT_LOCALITY_NAME } from '../../constants';

import MessageList from '../message-list';

import LocalityDropList from '../../component/project/locality/locality-drop-list';
import NewLocalityReveal from '../../component/project/locality/new-locality.reveal';

export type localitiesPropTypes = {
  project: Project,
};

export const Localities = ({ project }: localitiesPropTypes): React.Element<'div'> => {
  const [newLocalityParent, setNewLocalityParent] = useState();
  const [time] = useState(new Date().getTime());

  const dispatch = useDispatch();
  const projectLocalities = useSelector(localitiesSelector(project));

  const localityDropListRef = useRef(null);

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
    localityDropListRef.current.rebuildLocalityIdIndices(selectedLocality);
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

      <LocalityDropList
        ref={localityDropListRef}
        addLocality={addLocality}
        onLocalitySelect={localitySelected}
        projectLocalities={projectLocalities}
      />
    </div>
  );
};

export default Localities;
