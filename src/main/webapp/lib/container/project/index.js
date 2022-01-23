// @flow
import * as React from 'react';

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import Localities from '../../component/project/locality';
import Members from '../../component/project/member';
import { ProjectNavbar } from '../../component/project/navbar';
import type { tabType } from '../../component/project/navbar';

import { projectByIdSelector } from '../../redux/selector/project.selector';

function showCurrentTabOrLocalities(tab: tabType, project: Project) {
  switch (tab) {
    case 'members':
      return <Members project={project} />;
    default:
      return <Localities project={project} />;
  }
}

export type projectPropTypes = {
  id: number,
};

export const Project = ({ id }: projectPropTypes): React.Element<'div'> => {
  const project = useSelector(projectByIdSelector(id)) || {};
  const router = useRouter();

  const tab: tabType = router.query.tab || 'localities';

  return (
    <div className="project">
      <ProjectNavbar project={project} tab={tab} />

      <div>{showCurrentTabOrLocalities(tab, project)}</div>
    </div>
  );
};

export default Project;
