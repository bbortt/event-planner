// @flow
import * as React from 'react';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { localitiesLoad } from '../../../redux/action/locality.action';
import { localitiesSelector } from '../../../redux/selector/locality.selector';

import BackendAwareDndProvider from '../../../wrapper/dnd-provider';
import LocalityDrop from './locality.drop';
import LocalityDrag from './locality.drag';

import styles from './locality.module.scss';

export type localitiesPropTypes = {
  project: Project,
};

export const Localities = ({ project }: localitiesPropTypes): React.Element<'div'> => {
  const rootLocalities = useSelector(localitiesSelector(project, null));
  const dispatch = useDispatch();

  useEffect(() => dispatch(localitiesLoad(project)), [dispatch]);

  let selectedLocalities = [];

  return (
    <div className="project-localities">
      <div className="top-bar top-bar-bordered site-header">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text">Lokalitäte</li>
          </ul>
        </div>
      </div>

      <div className="grid-x grid-padding-x">
        <BackendAwareDndProvider>
          <div className={`cell medium-4 ${styles.localityDrop}`}>
            <LocalityDrop parentLocality={null}>
              {rootLocalities.map((locality: Locality, index: number) => (
                <LocalityDrag locality={locality} />
              ))}
            </LocalityDrop>
          </div>
        </BackendAwareDndProvider>
      </div>
    </div>
  );
};

export default Localities;
