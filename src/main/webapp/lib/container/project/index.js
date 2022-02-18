// @flow
import * as React from 'react';

import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';

import ProjectLocalities from './localities';
import Members from '../../component/project/member';
import type { tabType } from '../../component/project/navbar';
import { ProjectNavbar } from '../../component/project/navbar';

import { projectByIdSelector } from '../../redux/selector/project.selector';

function showCurrentTabOrLocalities(tab: tabType, project: Project) {
  switch (tab) {
    case 'members':
      return <Members project={project} />;
    default:
      return <ProjectLocalities project={project} />;
  }
}

export type projectPropTypes = {
  id: number,
};

export const ProjectDetails = ({ id }: projectPropTypes): React.Element<'div'> => {
  const project = useSelector(projectByIdSelector(id));
  const router = useRouter();

  const tab: tabType = router.query.tab || 'localities';

  return (
    <div className="project">
      {project && (
        <div>
          <ProjectNavbar project={project} tab={tab} />

          <div>{showCurrentTabOrLocalities(tab, project)}</div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
