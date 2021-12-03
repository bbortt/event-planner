// @flow
import * as React from 'react';

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import Location from '../../component/project/location';

import { projectByIdSelector } from '../../redux/selector/project.selector';

type tabType = 'locations';

function showCurrentTabOrLocations(tab: tabType) {
  switch (tab) {
    case 'locations':
      return <Location />;
  }
}

export type projectPropTypes = {
  id: number,
};

export const Project = ({ id }: projectPropTypes): React.Element<'div'> => {
  let project = useSelector(projectByIdSelector(id));
  let router = useRouter();

  const loadTab = (tab: tabType) => () => {
    router.push({ query: { ...router.query, tab } });
  };

  return (
    <div className="project">
      <div className="top-bar site-header">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text">{project.name}</li>
            <li>
              <a onClick={loadTab('locations')}>Lokalitäte</a>
            </li>
          </ul>
        </div>

        <div className="top-bar-right">
          <ul className="dropdown menu" data-dropdown-menu></ul>
        </div>
      </div>

      <div>{showCurrentTabOrLocations(router.query.tab || 'locations')}</div>
    </div>
  );
};

export default Project;
