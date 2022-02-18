// @flow
import * as React from 'react';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { projectsLoad } from '../../redux/action/project.action';
import { projectsSelector } from '../../redux/selector/project.selector';

import Callout from '../../foundation/callout';
import MessageList from '../message-list';
import NewProjectReveal from '../../component/project/new-project.reveal';
import ProjectCard from '../../component/project/card';

export const ProjectList = (): React.Element<'div'> => {
  const projects = useSelector(projectsSelector());
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(projectsLoad());
  }, [dispatch]);

  const newProjectRevealId = 'new-project-reveal';

  return (
    <div className="project-list">
      <div className="top-bar site-header">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text">Miner Projekt</li>
          </ul>
        </div>

        <div className="top-bar-right">
          <ul className="menu button-group">
            <li>
              <NewProjectReveal revealId={newProjectRevealId} />

              <button type="button" className="button success" data-open={newProjectRevealId} aria-label="Neues Projekt erfassen">
                neus Projekt
              </button>
            </li>
          </ul>
        </div>
      </div>

      <MessageList />

      <div className="grid-x grid-padding-x">
        {projects.length === 0 && (
          <div className="cell">
            <Callout type="warning">
              <h5>Du hesch momentan no kenner Projekt.</h5>
              <p>Entweder du hesch e Iladig oder machsch etz es neus!</p>
            </Callout>
          </div>
        )}

        {projects.map((project: Project, index: number) => (
          <div className="cell medium-4" key={index}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
