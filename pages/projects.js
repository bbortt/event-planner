// @flow
import * as React from 'react';

import { useRouter } from 'next/router';

import { withAuthenticationRequired } from '@auth0/auth0-react';

import Project from '../lib/container/project';
import ProjectList from '../lib/container/project/list';
import LoadingCallout from '../lib/layout/message/loading.callout';

export const Projects = (): React.Element<'div'> => {
  const router = useRouter();
  const { projectId } = router.query;

  if (projectId) {
    return (
      <div>
        <Project id={Number(projectId)} />
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
  onRedirecting: () => <LoadingCallout />,
}): React.Component<{}>);
