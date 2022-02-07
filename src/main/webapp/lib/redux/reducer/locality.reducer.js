// @flow
import merge from 'deepmerge';

import { localityAddType } from '../action/locality.action';
import type { localityAction, localityAddAction } from '../action/locality.action';

export const reduceProjectById = (projects: Project[], localityAction: localityAction): Project[] => {
  const rootLocality = travelLocalitiesUntilParent(localityAction.payload.locality);
  if (!rootLocality) {
    return projects;
  }

  const projectIndex = projects.findIndex(project => project.id === rootLocality.project?.id);
  if (projectIndex === -1) {
    return projects;
  }

  const project = projects[projectIndex];

  const newProjects = [];
  newProjects.push(projects.slice(0, projectIndex));
  newProjects.push({ ...project, localities: localityReducer(project.localities || [], localityAction) });
  newProjects.push(projects.slice(projectIndex + 1, projects.length));
  return newProjects;
};

const travelLocalitiesUntilParent = (locality: Locality): Locality | null => {
  if (locality.parent) {
    return travelLocalitiesUntilParent(locality.parent);
  } else if (locality.project) {
    return locality;
  } else {
    return null;
  }
};

type localitiesState = Array<Locality>;

const localityReducer = (state: localitiesState = [], action: localityAction): localitiesState => {
  switch (action.type) {
    case localityAddType:
      const { locality } = ((action: any): localityAddAction).payload;

      return merge.all([state, [locality]]);
    default:
      return state;
  }
};
