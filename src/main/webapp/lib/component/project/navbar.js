// @flow
import * as React from 'react';

import { useRouter } from 'next/router';

export type tabType = 'localities' | 'members';

export type projectNavbarPropTypes = {
  project: Project,
  tab: tabType,
};

export const ProjectNavbar = ({ project, tab }: projectNavbarPropTypes): React.Element<'div'> => {
  const router = useRouter();

  const loadTab = (nextTab: tabType) => () => {
    router.push({ query: { ...router.query, nextTab } });
  };

  return (
    <div className="project-navbar top-bar site-header">
      <div className="top-bar-left">
        <ul className="menu">
          <li className="menu-text">{project.name}</li>
          <li className={tab === 'localities' ? 'is-active' : ''}>
            <a onClick={loadTab('localities')}>Lokalitäte</a>
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
  );
};

export default ProjectNavbar;
