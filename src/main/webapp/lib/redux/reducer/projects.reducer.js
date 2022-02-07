// @flow
import type { projectAction, projectAddAction, projectsSetAction } from '../action/project.action';
import { projectAddType, projectsSetType } from '../action/project.action';

import type { localityAction } from '../action/locality.action';
import { localityAddType } from '../action/locality.action';
import { reduceProjectById } from './locality.reducer';

export type projectsState = Array<Project>;

export const projectsReducer = (state: projectsState = [], action: projectAction): projectsState => {
  switch (action.type) {
    case projectAddType:
      const { project } = ((action: any): projectAddAction).payload;
      return [...state, { ...project }];
    case projectsSetType:
      const { projects } = ((action: any): projectsSetAction).payload;
      return [...projects];
    case localityAddType:
      return [...reduceProjectById(state, ((action: any): localityAction))];
    default:
      return state;
  }
};
