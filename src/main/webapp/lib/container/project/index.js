// @flow
import * as React from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import Localities from '../../component/project/locality';
import Members from '../../component/project/member';

import { projectByIdSelector } from '../../redux/selector/project.selector';
import { useEffect } from 'react';
import { projectsLoad } from '../../redux/action/project.action';

type tabType = 'locations' | 'members';

function showCurrentTabOrLocalities(tab: tabType) {
  switch (tab) {
    case 'members':
      return <Members />;
    default:
      return <Localities />;
  }
}

export type projectPropTypes = {
  id: number,
};

export const Project = ({ id }: projectPropTypes): React.Element<'div'> => {
  let project = useSelector(projectByIdSelector(id)) || {};
  let router = useRouter();

  const loadTab = (tab: tabType) => () => {
    router.push({ query: { ...router.query, tab } });
  };

  const tab: tabType = router.query.tab || 'localities';

  return (
    <div className="project">
      <div className="top-bar site-header">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text">{project.name}</li>
            <li className={tab === 'locations' ? 'is-active' : ''}>
              <a onClick={loadTab('locations')}>Lokalitäte</a>
            </li>
            <li className={tab === 'members' ? 'is-active' : ''}>
              <a onClick={loadTab('members')}>Mitglider</a>
            </li>
          </ul>
        </div>

        <div className="top-bar-right">
          <ul className="dropdown menu" data-dropdown-menu></ul>
        </div>
      </div>

      <div>{showCurrentTabOrLocalities(tab)}</div>
    </div>
  );
};

export default Project;
