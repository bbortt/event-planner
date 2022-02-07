// @flow
import type { localityAction } from './locality.action';

export type projectAction = projectAddAction | projectCreateAction | projectsLoadAction | projectsSetAction | localityAction;

export const projectAddType = 'project:add';
export const projectCreateType = 'project:create';
export const projectsLoadType = 'project:load-list';
export const projectsSetType = 'project:set-list';

export type projectAddAction = { type: 'project:add', payload: { project: Project } };
export type projectCreateAction = { type: 'project:create', payload: { project: ProjectCreateInput } };
export type projectsLoadAction = { type: 'project:load-list', payload: { count?: number, offset?: number } };
export type projectsSetAction = { type: 'project:set-list', payload: { projects: Project[] } };

export const projectAdd = (project: Project): projectAddAction => ({ type: 'project:add', payload: { project } });
export const projectCreate = (project: ProjectCreateInput): projectCreateAction => ({
  type: 'project:create',
  payload: { project },
});
export const projectsLoad = (count?: number, offset?: number): projectsLoadAction => ({
  type: 'project:load-list',
  payload: { count, offset },
});
export const projectsSet = (projects: Project[]): projectsSetAction => ({
  type: 'project:set-list',
  payload: { projects },
});
