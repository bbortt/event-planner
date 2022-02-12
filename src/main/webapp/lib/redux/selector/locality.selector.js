// @flow
import type { applicationState } from '../store';

export const localitiesSelector =
  (project: Project): ((state: applicationState) => Locality[]) =>
  (state: applicationState): Locality[] =>
    state.projects.find(stateProject => stateProject.id === project.id)?.localities || [];
