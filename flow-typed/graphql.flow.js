// @flow

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {|
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  DateTime: any,
|};

export type Auth0UserDto = {|
  __typename?: 'Auth0UserDTO',
  email: $ElementType<Scalars, 'String'>,
  familyName?: ?$ElementType<Scalars, 'String'>,
  givenName?: ?$ElementType<Scalars, 'String'>,
  memberships?: ?Array<?MemberDto>,
  nickname: $ElementType<Scalars, 'String'>,
  picture?: ?$ElementType<Scalars, 'String'>,
  userId: $ElementType<Scalars, 'String'>,
|};

export type CreateLocalityInput = {|
  description?: ?$ElementType<Scalars, 'String'>,
  name: $ElementType<Scalars, 'String'>,
  parentLocalityId?: ?$ElementType<Scalars, 'ID'>,
|};

export type CreateProjectInput = {|
  description?: ?$ElementType<Scalars, 'String'>,
  endTime: $ElementType<Scalars, 'DateTime'>,
  name: $ElementType<Scalars, 'String'>,
  startTime: $ElementType<Scalars, 'DateTime'>,
|};

export type LocalityDto = {|
  __typename?: 'LocalityDTO',
  children?: ?Array<?LocalityDto>,
  description?: ?$ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'ID'>,
  name: $ElementType<Scalars, 'String'>,
  parent?: ?LocalityDto,
  project: ProjectDto,
|};

export type MemberDto = {|
  __typename?: 'MemberDTO',
  accepted: $ElementType<Scalars, 'Boolean'>,
  auth0User: Auth0UserDto,
  id: $ElementType<Scalars, 'ID'>,
  permissions?: ?Array<?PermissionDto>,
  project: ProjectDto,
|};

export type Mutation = {|
  __typename?: 'Mutation',
  createLocality: LocalityDto,
  createProject: ProjectDto,
  joinProject: MemberDto,
  moveLocality: LocalityDto,
  updateLocality: LocalityDto,
  updateProject: ProjectDto,
|};

export type MutationCreateLocalityArgs = {|
  locality: CreateLocalityInput,
  projectId: $ElementType<Scalars, 'ID'>,
|};

export type MutationCreateProjectArgs = {|
  project: CreateProjectInput,
|};

export type MutationJoinProjectArgs = {|
  token?: ?$ElementType<Scalars, 'String'>,
|};

export type MutationMoveLocalityArgs = {|
  fromLocalityId?: ?$ElementType<Scalars, 'ID'>,
  toLocalityId?: ?$ElementType<Scalars, 'ID'>,
|};

export type MutationUpdateLocalityArgs = {|
  locality: UpdateLocalityInput,
|};

export type MutationUpdateProjectArgs = {|
  project: ProjectUpdateInput,
|};

export type PermissionDto = {|
  __typename?: 'PermissionDTO',
  id: $ElementType<Scalars, 'String'>,
|};

export type ProjectDto = {|
  __typename?: 'ProjectDTO',
  archived: $ElementType<Scalars, 'Boolean'>,
  description?: ?$ElementType<Scalars, 'String'>,
  endTime: $ElementType<Scalars, 'DateTime'>,
  id: $ElementType<Scalars, 'ID'>,
  localities?: ?Array<?LocalityDto>,
  members?: ?Array<?MemberDto>,
  name: $ElementType<Scalars, 'String'>,
  startTime: $ElementType<Scalars, 'DateTime'>,
  token: $ElementType<Scalars, 'String'>,
|};

export type ProjectUpdateInput = {|
  archived?: ?$ElementType<Scalars, 'Boolean'>,
  description?: ?$ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'ID'>,
  name?: ?$ElementType<Scalars, 'String'>,
|};

export type Query = {|
  __typename?: 'Query',
  getMember?: ?MemberDto,
  listChildren: Array<?LocalityDto>,
  listMembers: Array<?MemberDto>,
  listProjects: Array<?ProjectDto>,
  listRootLocalities: Array<?LocalityDto>,
|};

export type QueryGetMemberArgs = {|
  memberId: $ElementType<Scalars, 'ID'>,
|};

export type QueryListChildrenArgs = {|
  localityId: $ElementType<Scalars, 'ID'>,
|};

export type QueryListMembersArgs = {|
  projectId: $ElementType<Scalars, 'ID'>,
|};

export type QueryListProjectsArgs = {|
  count?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
|};

export type QueryListRootLocalitiesArgs = {|
  projectId: $ElementType<Scalars, 'ID'>,
|};

export type UpdateLocalityInput = {|
  description?: ?$ElementType<Scalars, 'String'>,
  name?: ?$ElementType<Scalars, 'String'>,
|};
