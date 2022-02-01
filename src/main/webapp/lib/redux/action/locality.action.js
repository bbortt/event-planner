// @flow
export type localityAction = localityAddAction | localityCreateAction | localitiesLoadAction;

export const localityAddType = 'locality:add';
export const localityCreateType = 'locality:create';
export const localitiesLoadType = 'locality:load-list';

export type localityAddAction = { type: 'locality:add', payload: { locality: Locality } };
export type localityCreateAction = { type: 'locality:create', payload: { project: Project, locality: LocalityCreateInput } };
export type localitiesLoadAction = {
  type: 'locality:load-list',
  payload: { project?: Project, parent?: Locality },
};

export const localityAdd = (locality: Locality): localityAddAction => ({
  type: 'locality:add',
  payload: { locality },
});
export const localityCreate = (project: Project, locality: LocalityCreateInput): localityCreateAction => ({
  type: 'locality:create',
  payload: { project, locality },
});
export const localitiesLoad = (project?: Project, parent?: Locality): localitiesLoadAction => ({
  type: 'locality:load-list',
  payload: { project, parent },
});
