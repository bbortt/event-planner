// @flow
import type { applicationState } from '../store';

export const projectByIdSelector =
  (id: number): ((state: applicationState) => Project | void) =>
  (state: applicationState): Project | void =>
    state.projects.find(project => project.id === id);
export const projectsSelector =
  (): ((state: applicationState) => Project[]) =>
  (state: applicationState): Project[] =>
    state.projects;
