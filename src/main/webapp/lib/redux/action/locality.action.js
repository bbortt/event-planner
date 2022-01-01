// @flow
export type localityAction = localityAddAction;

export const localityAddType = 'locality:add';

export type localityAddAction = { type: 'locality:add', payload: { project: Project, locality: Locality } };

export const localityAdd = (project: Project, locality: Locality) => ({ type: 'locality:add', payload: { project, locality } });
