// @flow
import * as React from 'react';

import Callout from '../../foundation/callout';

import styles from './card.module.scss';

export type projectCardPropTypes = {
  project: Project,
};

export const ProjectCard = ({ project }: projectCardPropTypes): React.Element<'div'> => {
  return (
    <div className="project-card">
      <Callout type="" fit={false}>
        <h5>{project.name}</h5>
        <p className={styles.description}>
          <i>{project.description || 'Das Projekt het ke Beschribig..'}</i>
        </p>
      </Callout>
    </div>
  );
};

export default ProjectCard;
