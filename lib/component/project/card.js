// @flow
import * as React from 'react';

import Link from 'next/link';
import Router from 'next/router';

import Callout from '../../foundation/callout';

import styles from './card.module.scss';

export type projectCardPropTypes = {
  project: Project,
};

export const ProjectCard = ({ project }: projectCardPropTypes): React.Element<'div'> => {
  const loadProject = () => {
    Router.push({ query: { projectId: project.id } });
  };

  return (
    <div className="project-card hoverable" onClick={loadProject}>
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
