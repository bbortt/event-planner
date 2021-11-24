// @flow
export type projectAction = projectAddAction | projectCreateAction | projectsLoadAction | projectsSetAction;

export const projectAddType = 'project:add';
export const projectCreateType = 'project:create';
export const projectsLoadType = 'project:load-list';
export const projectsSetType = 'project:set';

export type projectAddAction = { type: 'project:add', payload: { project: Project } };
export type projectCreateAction = { type: 'project:create', payload: { project: Project_Insert_Input, user: Auth0_User } };
export type projectsLoadAction = { type: 'project:load-list', payload: { count?: number, offset?: number } };
export type projectsSetAction = { type: 'project:set', payload: { projects: Project[] } };

export const projectAdd = (project: Project): projectAddAction => ({ type: 'project:add', payload: { project } });
export const projectCreate = (project: Project_Insert_Input, user: Auth0_User): projectCreateAction => ({
  type: 'project:create',
  payload: { project, user },
});
export const projectsLoad = (count?: number, offset?: number): projectsLoadAction => ({
  type: 'project:load-list',
  payload: { count, offset },
});
export const projectsSet = (projects: Project[]): projectsSetAction => ({
  type: 'project:set',
  payload: { projects },
});
