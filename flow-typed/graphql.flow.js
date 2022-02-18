// @flow

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {|
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Date: any,
|};

export type Auth0User = {|
  __typename?: 'Auth0User',
  email: $ElementType<Scalars, 'String'>,
  familyName?: ?$ElementType<Scalars, 'String'>,
  givenName?: ?$ElementType<Scalars, 'String'>,
  memberships: Array<Member>,
  nickname: $ElementType<Scalars, 'String'>,
  picture?: ?$ElementType<Scalars, 'String'>,
  userId: $ElementType<Scalars, 'String'>,
|};

export type Locality = {|
  __typename?: 'Locality',
  children: Array<Locality>,
  description?: ?$ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'ID'>,
  name: $ElementType<Scalars, 'String'>,
  parent?: ?Locality,
  project: Project,
|};

export type LocalityCreateInput = {|
  description?: ?$ElementType<Scalars, 'String'>,
  name: $ElementType<Scalars, 'String'>,
  parentLocalityId?: ?$ElementType<Scalars, 'ID'>,
|};

export type LocalityUpdateInput = {|
  description?: ?$ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'ID'>,
  name?: ?$ElementType<Scalars, 'String'>,
  newParentLocalityId?: ?$ElementType<Scalars, 'ID'>,
|};

export type Member = {|
  __typename?: 'Member',
  accepted: $ElementType<Scalars, 'Boolean'>,
  auth0User: Auth0User,
  id: $ElementType<Scalars, 'ID'>,
  permissions: Array<Permission>,
  project: Project,
|};

export type Mutation = {|
  __typename?: 'Mutation',
  createLocality: Locality,
  createProject: Project,
  joinProject: Member,
  updateLocality: Locality,
  updateProject: Project,
|};

export type MutationCreateLocalityArgs = {|
  locality: LocalityCreateInput,
  projectId: $ElementType<Scalars, 'ID'>,
|};

export type MutationCreateProjectArgs = {|
  project: ProjectCreateInput,
|};

export type MutationJoinProjectArgs = {|
  token?: ?$ElementType<Scalars, 'String'>,
|};

export type MutationUpdateLocalityArgs = {|
  locality: LocalityUpdateInput,
|};

export type MutationUpdateProjectArgs = {|
  project: ProjectUpdateInput,
|};

export type Permission = {|
  __typename?: 'Permission',
  members: Array<Member>,
|};

export type Project = {|
  __typename?: 'Project',
  archived: $ElementType<Scalars, 'Boolean'>,
  description?: ?$ElementType<Scalars, 'String'>,
  endDate: $ElementType<Scalars, 'Date'>,
  id: $ElementType<Scalars, 'ID'>,
  localities: Array<Locality>,
  members: Array<Member>,
  name: $ElementType<Scalars, 'String'>,
  startDate: $ElementType<Scalars, 'Date'>,
  token: $ElementType<Scalars, 'String'>,
|};

export type ProjectCreateInput = {|
  description?: ?$ElementType<Scalars, 'String'>,
  endDate: $ElementType<Scalars, 'Date'>,
  name: $ElementType<Scalars, 'String'>,
  startDate: $ElementType<Scalars, 'Date'>,
|};

export type ProjectUpdateInput = {|
  archived?: ?$ElementType<Scalars, 'Boolean'>,
  description?: ?$ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'ID'>,
  name?: ?$ElementType<Scalars, 'String'>,
|};

export type Query = {|
  __typename?: 'Query',
  getMember: Member,
  listLocalities: Array<Locality>,
  listMembers: Array<Member>,
  listProjects: Array<Project>,
|};

export type QueryGetMemberArgs = {|
  memberId: $ElementType<Scalars, 'ID'>,
|};

export type QueryListLocalitiesArgs = {|
  parentLocalityId?: ?$ElementType<Scalars, 'ID'>,
  projectId: $ElementType<Scalars, 'ID'>,
|};

export type QueryListMembersArgs = {|
  projectId: $ElementType<Scalars, 'ID'>,
|};

export type QueryListProjectsArgs = {|
  count?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
|};
