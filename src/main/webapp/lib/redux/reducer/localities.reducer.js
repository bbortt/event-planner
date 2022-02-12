// @flow
import { localityAddType } from '../action/locality.action';
import type { localityAction, localityAddAction } from '../action/locality.action';

export const reduceProjectById = (projects: Array[Project], localityAction: localityAction): Array<Project> => {
  const projectIndex = projects.findIndex(project => project.id === localityAction.payload.locality.project?.id);
  if (projectIndex === -1) {
    return projects;
  }

  const project = projects[projectIndex];

  const newProjects = [];
  projects.slice(0, projectIndex).forEach(newProjects.push);
  newProjects.push({ ...project, localities: localitiesReducer(project.localities || [], localityAction) });
  projects.slice(projectIndex + 1, projects.length).forEach(newProjects.push);
  return newProjects;
};

type localitiesState = Array<Locality>;

const localitiesReducer = (state: localitiesState = [], action: localityAction): localitiesState => {
  switch (action.type) {
    case localityAddType:
      const { locality } = ((action: any): localityAddAction).payload;
      return mergeLocalities(state, [locality]);
    default:
      return state;
  }
};

const mergeLocalities = (a: Array<Locality>, b: Array<Locality>): Array<Locality> => {
  const result = a.slice();

  b.forEach(bLocality => {
    const i = result.findIndex(aLocality => aLocality.id === bLocality.id);

    if (i !== -1) {
      result[i] = mergeLocality(result[i], bLocality);
    } else {
      const p = result.findIndex(aLocality => bLocality.parent && aLocality.id === bLocality.parent.id);

      if (p !== -1) {
        const parentLocality = result[p];
        result[p] = { ...parentLocality, children: mergeLocalities(parentLocality.children || [], [bLocality]) };

        console.log('merged: ', result[p]);
      } else {
        result.push(bLocality);
      }
    }
  });

  return result;
};

const mergeLocality = (a: Locality, b: Locality): Locality => {
  return {
    __typename: 'Locality',
    children: mergeLocalities(a.children || [], b.children || []),
    description: b.description ? b.description : a.description,
    id: b.id ? b.id : a.id,
    name: b.name ? b.name : a.name,
    parent: b.parent ? b.parent : a.parent,
    project: b.project ? b.project : a.project,
  };
};
