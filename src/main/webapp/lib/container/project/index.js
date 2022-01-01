// @flow
import * as React from 'react';

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import Localities from '../../component/project/locality';
import Members from '../../component/project/member';
import { ProjectNavbar } from '../../component/project/navbar';
import type { tabType } from '../../component/project/navbar';

import { projectByIdSelector } from '../../redux/selector/project.selector';

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

  const tab: tabType = router.query.tab || 'localities';

  return (
    <div className="project">
      <ProjectNavbar project={project} tab={tab} />

      <div>{showCurrentTabOrLocalities(tab)}</div>
    </div>
  );
};

export default Project;
