// @flow
import * as React from 'react';

import { useSelector } from 'react-redux';

import { projectByIdSelector } from '../../redux/selector/project.selector';

export type projectPropTypes = {
  id: number,
};

export const Project = ({ id }: projectPropTypes): React.Element<'div'> => {
  let project = useSelector(projectByIdSelector(id));

  return (
    <div className="project">
      <div className="top-bar site-header">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text">{project.name}</li>
          </ul>
        </div>

        <div className="top-bar-right">
          <ul className="menu button-group"></ul>
        </div>
      </div>
    </div>
  );
};

export default Project;
