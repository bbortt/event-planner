// @flow
import type { applicationState } from '../store';

export const localitiesSelector =
  (project: Project, parentLocality?: Locality): ((state: applicationState) => Locality[]) =>
  (state: applicationState): Locality[] =>
    // TODO: Filter localities!
    state.projects.find(stateProject => stateProject.id === project.id)?.localities || [];
