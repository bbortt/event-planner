// @flow
import * as React from 'react';

export type projectPropTypes = {
  id: number,
};

export const Project = ({ id }: projectPropTypes): React.Element<'div'> => {
  return <div className="project"></div>;
};

export default Project;
