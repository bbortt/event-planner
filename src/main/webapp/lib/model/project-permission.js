export const projectUpdate: ProjectPermission = 'project:update';

export const memberList: ProjectPermission = 'member:list';
export const memberAccept: ProjectPermission = 'member:accept';
export const memberRemove: ProjectPermission = 'member:remove';

export const permissionList: ProjectPermission = 'permission:list';
export const permissionAssign: ProjectPermission = 'permission:assign';
export const permissionRevoke: ProjectPermission = 'permission:revoke';

export const localityCreate: ProjectPermission = 'locality:create';
export const localityList: ProjectPermission = 'locality:list';
export const localityEdit: ProjectPermission = 'locality:edit';
export const localityMove: ProjectPermission = 'locality:move';
export const localityDelete: ProjectPermission = 'locality:delete';

export type ProjectPermission =
  | projectUpdate
  | memberList
  | memberAccept
  | memberRemove
  | permissionList
  | permissionAssign
  | permissionRevoke
  | localityCreate
  | localityList
  | localityEdit
  | localityMove
  | localityDelete;

export const allProjectPermissions = [
  projectUpdate,
  memberList,
  memberAccept,
  memberRemove,
  permissionList,
  permissionAssign,
  permissionRevoke,
  localityCreate,
  localityList,
  localityEdit,
  localityMove,
  localityDelete,
];
