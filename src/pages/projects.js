// @flow
import * as React from 'react';

import { useRouter } from 'next/router';

import { withAuthenticationRequired } from '@auth0/auth0-react';
import saveRouterAndRedirect from 'lib/auth0/save-router-and-redirect';

import ProjectDetails from 'lib/container/project';
import ProjectList from 'lib/container/project/list';

export const Projects = (): React.Element<'div'> => {
  const router = useRouter();
  const { projectId } = router.query;

  if (projectId) {
    return (
      <div>
        <ProjectDetails id={projectId} />
      </div>
    );
  }

  return (
    <div>
      <title>Event Planer | Projekt</title>

      <ProjectList />
    </div>
  );
};

export default (withAuthenticationRequired(Projects, {
  onRedirecting: saveRouterAndRedirect,
}): React.Component<{}>);
