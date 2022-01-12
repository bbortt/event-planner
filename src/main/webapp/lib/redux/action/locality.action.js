// @flow
export type localityAction = localityAddAction;

export const localityAddType = 'locality:add';
export const localityCreateType = 'locality:create';
export const localitiesLoadType = 'locality:load-list';
export const localitiesSetType = 'locality:set-list';

export type localityAddAction = { type: 'locality:add', payload: { locality: Locality } };
export type localityCreateAction = { type: 'locality:create', payload: { project: Project, locality: LocalityCreateInput } };
export type localitiesLoadAction = {
  type: 'locality:load-list',
  payload: { project?: Project, parent?: Locality, count?: number, offset?: number },
};
export type localitiesSetAction = { type: 'locality:set-list', payload: { parent: Locality, localities: Locality[] } };

export const localityAdd = (project: Project, locality: Locality): localityAddAction => ({
  type: 'locality:add',
  payload: { project, locality },
});
export const localityCreate = (project: Project, locality: LocalityCreateInput): localityCreateAction => ({
  type: 'locality:create',
  payload: { project, locality },
});
export const localitiesLoad = (project?: Project, parent?: Locality, count?: number, offset?: number): localitiesLoadAction => ({
  type: 'locality:load-list',
  payload: { project, parent, count, offset },
});
export const localitiesSet = (parent: Locality, localities: Locality[]): localitiesSetAction => ({
  type: 'locality:set-list',
  payload: { parent, localities },
});
