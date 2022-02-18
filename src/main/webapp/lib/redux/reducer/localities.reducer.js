// @flow
import type { localityAction, localityAddAction } from '../action/locality.action';
import { localityAddType } from '../action/locality.action';

import { cutIndexFromArray } from '../../constants';

export const reduceProjectById = (projects: Array[Project], localityAction: localityAction): Array<Project> => {
  const projectIndex = projects.findIndex(project => project.id === localityAction.payload.locality.project?.id);
  if (projectIndex === -1) {
    return projects;
  }

  const project = projects[projectIndex];

  const newProjects = [];
  projects.slice(0, projectIndex).forEach(project => newProjects.push(project));
  newProjects.push({
    ...project,
    localities: localitiesReducer(project.localities || [], localityAction),
  });
  projects.slice(projectIndex + 1, projects.length).forEach(project => newProjects.push(project));
  return newProjects;
};

type localitiesState = Array<Locality>;

const localitiesReducer = (state: localitiesState = [], action: localityAction): localitiesState => {
  switch (action.type) {
    case localityAddType: {
      const { locality } = ((action: any): localityAddAction).payload;
      return mergeLocalities({ children: state }, [locality]);
    }
    default:
      return state;
  }
};

const mergeLocalities = (a: Locality, b: Array<Locality>): Array<Locality> => {
  const result = (a.children || []).slice();
  const leftovers = b.slice();

  leftovers.forEach((bLocality, i) => {
    if (!bLocality) {
      return;
    } else if (!bLocality.parent) {
      result.push(bLocality);
      delete leftovers[i];
      return;
    }

    const matchIndex = result.findIndex(aLocality => aLocality.id === bLocality.id);
    const parentIndex = result.findIndex(aLocality => aLocality.id === bLocality.parent.id);

    if (matchIndex !== -1) {
      if (a.id !== bLocality.parent.id) {
        result.splice(i, 1);
      } else {
        result[matchIndex] = mergeLocality(result[matchIndex], bLocality);
        delete leftovers[i];
      }
    } else if (parentIndex !== -1) {
      const parentLocality = result[parentIndex];
      let children = parentLocality.children || [];
      const childrenMatchLookahead = children.findIndex(aLocality => aLocality.id === bLocality.id);

      if (childrenMatchLookahead === -1) {
        children.push(bLocality);
      } else {
        children[childrenMatchLookahead] = mergeLocality(children[childrenMatchLookahead], bLocality);
      }

      result[parentIndex] = { ...parentLocality, children };
      delete leftovers[i];
    }
  });

  if (leftovers.filter(bLocality => !!bLocality).length !== 0) {
    result
      .filter(aLocality => aLocality.children)
      .forEach(
        aLocality =>
          (aLocality.children = mergeLocalities(
            aLocality,
            leftovers.filter(bLocality => !!bLocality)
          ))
      );
  }

  return result;
};

const mergeLocality = (a: Locality, b: Locality): Locality => {
  return {
    __typename: 'Locality',
    children: mergeLocalities(a, b.children || []),
    description: b.description ? b.description : a.description,
    id: b.id ? b.id : a.id,
    name: b.name ? b.name : a.name,
    parent: b.parent ? b.parent : a.parent,
    project: b.project ? b.project : a.project,
  };
};
