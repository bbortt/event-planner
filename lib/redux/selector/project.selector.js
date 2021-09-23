// @flow
import type { applicationState } from '../store';

export const projectsSelector = (state: applicationState): Project[] => state.projects;
