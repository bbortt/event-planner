// @flow

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {|
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  bigint: any,
  bpchar: any,
  timestamptz: any,
|};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {|
  _eq?: ?$ElementType<Scalars, 'Boolean'>,
  _gt?: ?$ElementType<Scalars, 'Boolean'>,
  _gte?: ?$ElementType<Scalars, 'Boolean'>,
  _in?: ?Array<$ElementType<Scalars, 'Boolean'>>,
  _is_null?: ?$ElementType<Scalars, 'Boolean'>,
  _lt?: ?$ElementType<Scalars, 'Boolean'>,
  _lte?: ?$ElementType<Scalars, 'Boolean'>,
  _neq?: ?$ElementType<Scalars, 'Boolean'>,
  _nin?: ?Array<$ElementType<Scalars, 'Boolean'>>,
|};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {|
  _eq?: ?$ElementType<Scalars, 'String'>,
  _gt?: ?$ElementType<Scalars, 'String'>,
  _gte?: ?$ElementType<Scalars, 'String'>,
  /** does the column match the given case-insensitive pattern */
  _ilike?: ?$ElementType<Scalars, 'String'>,
  _in?: ?Array<$ElementType<Scalars, 'String'>>,
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: ?$ElementType<Scalars, 'String'>,
  _is_null?: ?$ElementType<Scalars, 'Boolean'>,
  /** does the column match the given pattern */
  _like?: ?$ElementType<Scalars, 'String'>,
  _lt?: ?$ElementType<Scalars, 'String'>,
  _lte?: ?$ElementType<Scalars, 'String'>,
  _neq?: ?$ElementType<Scalars, 'String'>,
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: ?$ElementType<Scalars, 'String'>,
  _nin?: ?Array<$ElementType<Scalars, 'String'>>,
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: ?$ElementType<Scalars, 'String'>,
  /** does the column NOT match the given pattern */
  _nlike?: ?$ElementType<Scalars, 'String'>,
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: ?$ElementType<Scalars, 'String'>,
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: ?$ElementType<Scalars, 'String'>,
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: ?$ElementType<Scalars, 'String'>,
  /** does the column match the given SQL regular expression */
  _similar?: ?$ElementType<Scalars, 'String'>,
|};

/** columns and relationships of "auth0_user" */
export type Auth0_User = {|
  __typename?: 'auth0_user',
  email: $ElementType<Scalars, 'String'>,
  family_name?: ?$ElementType<Scalars, 'String'>,
  given_name?: ?$ElementType<Scalars, 'String'>,
  /** An array relationship */
  memberships: Array<Member>,
  /** An aggregate relationship */
  memberships_aggregate: Member_Aggregate,
  nickname: $ElementType<Scalars, 'String'>,
  picture?: ?$ElementType<Scalars, 'String'>,
  user_id: $ElementType<Scalars, 'String'>,
|};

/** columns and relationships of "auth0_user" */
export type Auth0_UserMembershipsArgs = {|
  distinct_on?: ?Array<Member_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Order_By>,
  where?: ?Member_Bool_Exp,
|};

/** columns and relationships of "auth0_user" */
export type Auth0_UserMemberships_AggregateArgs = {|
  distinct_on?: ?Array<Member_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Order_By>,
  where?: ?Member_Bool_Exp,
|};

/** aggregated selection of "auth0_user" */
export type Auth0_User_Aggregate = {|
  __typename?: 'auth0_user_aggregate',
  aggregate?: ?Auth0_User_Aggregate_Fields,
  nodes: Array<Auth0_User>,
|};

/** aggregate fields of "auth0_user" */
export type Auth0_User_Aggregate_Fields = {|
  __typename?: 'auth0_user_aggregate_fields',
  count: $ElementType<Scalars, 'Int'>,
  max?: ?Auth0_User_Max_Fields,
  min?: ?Auth0_User_Min_Fields,
|};

/** aggregate fields of "auth0_user" */
export type Auth0_User_Aggregate_FieldsCountArgs = {|
  columns?: ?Array<Auth0_User_Select_Column>,
  distinct?: ?$ElementType<Scalars, 'Boolean'>,
|};

/** Boolean expression to filter rows from the table "auth0_user". All fields are combined with a logical 'AND'. */
export type Auth0_User_Bool_Exp = {|
  _and?: ?Array<Auth0_User_Bool_Exp>,
  _not?: ?Auth0_User_Bool_Exp,
  _or?: ?Array<Auth0_User_Bool_Exp>,
  email?: ?String_Comparison_Exp,
  family_name?: ?String_Comparison_Exp,
  given_name?: ?String_Comparison_Exp,
  memberships?: ?Member_Bool_Exp,
  nickname?: ?String_Comparison_Exp,
  picture?: ?String_Comparison_Exp,
  user_id?: ?String_Comparison_Exp,
|};

export const Auth0_User_ConstraintValues = Object.freeze({
  /** unique or primary key constraint */
  Auth0UserPkey: 'auth0_user_pkey',
  /** unique or primary key constraint */
  UniqueEmail: 'unique_email',
});

/** unique or primary key constraints on table "auth0_user" */
export type Auth0_User_Constraint = $Values<typeof Auth0_User_ConstraintValues>;

/** input type for inserting data into table "auth0_user" */
export type Auth0_User_Insert_Input = {|
  email?: ?$ElementType<Scalars, 'String'>,
  family_name?: ?$ElementType<Scalars, 'String'>,
  given_name?: ?$ElementType<Scalars, 'String'>,
  memberships?: ?Member_Arr_Rel_Insert_Input,
  nickname?: ?$ElementType<Scalars, 'String'>,
  picture?: ?$ElementType<Scalars, 'String'>,
  user_id?: ?$ElementType<Scalars, 'String'>,
|};

/** aggregate max on columns */
export type Auth0_User_Max_Fields = {|
  __typename?: 'auth0_user_max_fields',
  email?: ?$ElementType<Scalars, 'String'>,
  family_name?: ?$ElementType<Scalars, 'String'>,
  given_name?: ?$ElementType<Scalars, 'String'>,
  nickname?: ?$ElementType<Scalars, 'String'>,
  picture?: ?$ElementType<Scalars, 'String'>,
  user_id?: ?$ElementType<Scalars, 'String'>,
|};

/** aggregate min on columns */
export type Auth0_User_Min_Fields = {|
  __typename?: 'auth0_user_min_fields',
  email?: ?$ElementType<Scalars, 'String'>,
  family_name?: ?$ElementType<Scalars, 'String'>,
  given_name?: ?$ElementType<Scalars, 'String'>,
  nickname?: ?$ElementType<Scalars, 'String'>,
  picture?: ?$ElementType<Scalars, 'String'>,
  user_id?: ?$ElementType<Scalars, 'String'>,
|};

/** response of any mutation on the table "auth0_user" */
export type Auth0_User_Mutation_Response = {|
  __typename?: 'auth0_user_mutation_response',
  /** number of rows affected by the mutation */
  affected_rows: $ElementType<Scalars, 'Int'>,
  /** data from the rows affected by the mutation */
  returning: Array<Auth0_User>,
|};

/** input type for inserting object relation for remote table "auth0_user" */
export type Auth0_User_Obj_Rel_Insert_Input = {|
  data: Auth0_User_Insert_Input,
  /** on conflict condition */
  on_conflict?: ?Auth0_User_On_Conflict,
|};

/** on conflict condition type for table "auth0_user" */
export type Auth0_User_On_Conflict = {|
  constraint: Auth0_User_Constraint,
  update_columns: Array<Auth0_User_Update_Column>,
  where?: ?Auth0_User_Bool_Exp,
|};

/** Ordering options when selecting data from "auth0_user". */
export type Auth0_User_Order_By = {|
  email?: ?Order_By,
  family_name?: ?Order_By,
  given_name?: ?Order_By,
  memberships_aggregate?: ?Member_Aggregate_Order_By,
  nickname?: ?Order_By,
  picture?: ?Order_By,
  user_id?: ?Order_By,
|};

/** primary key columns input for table: auth0_user */
export type Auth0_User_Pk_Columns_Input = {|
  user_id: $ElementType<Scalars, 'String'>,
|};

export const Auth0_User_Select_ColumnValues = Object.freeze({
  /** column name */
  Email: 'email',
  /** column name */
  FamilyName: 'family_name',
  /** column name */
  GivenName: 'given_name',
  /** column name */
  Nickname: 'nickname',
  /** column name */
  Picture: 'picture',
  /** column name */
  UserId: 'user_id',
});

/** select columns of table "auth0_user" */
export type Auth0_User_Select_Column = $Values<typeof Auth0_User_Select_ColumnValues>;

/** input type for updating data in table "auth0_user" */
export type Auth0_User_Set_Input = {|
  email?: ?$ElementType<Scalars, 'String'>,
  family_name?: ?$ElementType<Scalars, 'String'>,
  given_name?: ?$ElementType<Scalars, 'String'>,
  nickname?: ?$ElementType<Scalars, 'String'>,
  picture?: ?$ElementType<Scalars, 'String'>,
  user_id?: ?$ElementType<Scalars, 'String'>,
|};

export const Auth0_User_Update_ColumnValues = Object.freeze({
  /** column name */
  Email: 'email',
  /** column name */
  FamilyName: 'family_name',
  /** column name */
  GivenName: 'given_name',
  /** column name */
  Nickname: 'nickname',
  /** column name */
  Picture: 'picture',
  /** column name */
  UserId: 'user_id',
});

/** update columns of table "auth0_user" */
export type Auth0_User_Update_Column = $Values<typeof Auth0_User_Update_ColumnValues>;

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {|
  _eq?: ?$ElementType<Scalars, 'bigint'>,
  _gt?: ?$ElementType<Scalars, 'bigint'>,
  _gte?: ?$ElementType<Scalars, 'bigint'>,
  _in?: ?Array<$ElementType<Scalars, 'bigint'>>,
  _is_null?: ?$ElementType<Scalars, 'Boolean'>,
  _lt?: ?$ElementType<Scalars, 'bigint'>,
  _lte?: ?$ElementType<Scalars, 'bigint'>,
  _neq?: ?$ElementType<Scalars, 'bigint'>,
  _nin?: ?Array<$ElementType<Scalars, 'bigint'>>,
|};

/** Boolean expression to compare columns of type "bpchar". All fields are combined with logical 'AND'. */
export type Bpchar_Comparison_Exp = {|
  _eq?: ?$ElementType<Scalars, 'bpchar'>,
  _gt?: ?$ElementType<Scalars, 'bpchar'>,
  _gte?: ?$ElementType<Scalars, 'bpchar'>,
  /** does the column match the given case-insensitive pattern */
  _ilike?: ?$ElementType<Scalars, 'bpchar'>,
  _in?: ?Array<$ElementType<Scalars, 'bpchar'>>,
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: ?$ElementType<Scalars, 'bpchar'>,
  _is_null?: ?$ElementType<Scalars, 'Boolean'>,
  /** does the column match the given pattern */
  _like?: ?$ElementType<Scalars, 'bpchar'>,
  _lt?: ?$ElementType<Scalars, 'bpchar'>,
  _lte?: ?$ElementType<Scalars, 'bpchar'>,
  _neq?: ?$ElementType<Scalars, 'bpchar'>,
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: ?$ElementType<Scalars, 'bpchar'>,
  _nin?: ?Array<$ElementType<Scalars, 'bpchar'>>,
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: ?$ElementType<Scalars, 'bpchar'>,
  /** does the column NOT match the given pattern */
  _nlike?: ?$ElementType<Scalars, 'bpchar'>,
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: ?$ElementType<Scalars, 'bpchar'>,
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: ?$ElementType<Scalars, 'bpchar'>,
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: ?$ElementType<Scalars, 'bpchar'>,
  /** does the column match the given SQL regular expression */
  _similar?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** columns and relationships of "locality" */
export type Locality = {|
  __typename?: 'locality',
  /** An array relationship */
  children: Array<Locality>,
  /** An aggregate relationship */
  children_aggregate: Locality_Aggregate,
  created_at: $ElementType<Scalars, 'timestamptz'>,
  created_by: $ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'bigint'>,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by: $ElementType<Scalars, 'String'>,
  locality_id?: ?$ElementType<Scalars, 'bigint'>,
  name: $ElementType<Scalars, 'String'>,
  /** An object relationship */
  parent?: ?Locality,
  /** An object relationship */
  project: Project,
  project_id: $ElementType<Scalars, 'bigint'>,
|};

/** columns and relationships of "locality" */
export type LocalityChildrenArgs = {|
  distinct_on?: ?Array<Locality_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Locality_Order_By>,
  where?: ?Locality_Bool_Exp,
|};

/** columns and relationships of "locality" */
export type LocalityChildren_AggregateArgs = {|
  distinct_on?: ?Array<Locality_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Locality_Order_By>,
  where?: ?Locality_Bool_Exp,
|};

/** aggregated selection of "locality" */
export type Locality_Aggregate = {|
  __typename?: 'locality_aggregate',
  aggregate?: ?Locality_Aggregate_Fields,
  nodes: Array<Locality>,
|};

/** aggregate fields of "locality" */
export type Locality_Aggregate_Fields = {|
  __typename?: 'locality_aggregate_fields',
  avg?: ?Locality_Avg_Fields,
  count: $ElementType<Scalars, 'Int'>,
  max?: ?Locality_Max_Fields,
  min?: ?Locality_Min_Fields,
  stddev?: ?Locality_Stddev_Fields,
  stddev_pop?: ?Locality_Stddev_Pop_Fields,
  stddev_samp?: ?Locality_Stddev_Samp_Fields,
  sum?: ?Locality_Sum_Fields,
  var_pop?: ?Locality_Var_Pop_Fields,
  var_samp?: ?Locality_Var_Samp_Fields,
  variance?: ?Locality_Variance_Fields,
|};

/** aggregate fields of "locality" */
export type Locality_Aggregate_FieldsCountArgs = {|
  columns?: ?Array<Locality_Select_Column>,
  distinct?: ?$ElementType<Scalars, 'Boolean'>,
|};

/** order by aggregate values of table "locality" */
export type Locality_Aggregate_Order_By = {|
  avg?: ?Locality_Avg_Order_By,
  count?: ?Order_By,
  max?: ?Locality_Max_Order_By,
  min?: ?Locality_Min_Order_By,
  stddev?: ?Locality_Stddev_Order_By,
  stddev_pop?: ?Locality_Stddev_Pop_Order_By,
  stddev_samp?: ?Locality_Stddev_Samp_Order_By,
  sum?: ?Locality_Sum_Order_By,
  var_pop?: ?Locality_Var_Pop_Order_By,
  var_samp?: ?Locality_Var_Samp_Order_By,
  variance?: ?Locality_Variance_Order_By,
|};

/** input type for inserting array relation for remote table "locality" */
export type Locality_Arr_Rel_Insert_Input = {|
  data: Array<Locality_Insert_Input>,
  /** on conflict condition */
  on_conflict?: ?Locality_On_Conflict,
|};

/** aggregate avg on columns */
export type Locality_Avg_Fields = {|
  __typename?: 'locality_avg_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  locality_id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by avg() on columns of table "locality" */
export type Locality_Avg_Order_By = {|
  id?: ?Order_By,
  locality_id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** Boolean expression to filter rows from the table "locality". All fields are combined with a logical 'AND'. */
export type Locality_Bool_Exp = {|
  _and?: ?Array<Locality_Bool_Exp>,
  _not?: ?Locality_Bool_Exp,
  _or?: ?Array<Locality_Bool_Exp>,
  children?: ?Locality_Bool_Exp,
  created_at?: ?Timestamptz_Comparison_Exp,
  created_by?: ?String_Comparison_Exp,
  description?: ?String_Comparison_Exp,
  id?: ?Bigint_Comparison_Exp,
  last_updated_at?: ?Timestamptz_Comparison_Exp,
  last_updated_by?: ?String_Comparison_Exp,
  locality_id?: ?Bigint_Comparison_Exp,
  name?: ?String_Comparison_Exp,
  parent?: ?Locality_Bool_Exp,
  project?: ?Project_Bool_Exp,
  project_id?: ?Bigint_Comparison_Exp,
|};

export const Locality_ConstraintValues = Object.freeze({
  /** unique or primary key constraint */
  LocalityPkey: 'locality_pkey',
});

/** unique or primary key constraints on table "locality" */
export type Locality_Constraint = $Values<typeof Locality_ConstraintValues>;

/** input type for incrementing numeric columns in table "locality" */
export type Locality_Inc_Input = {|
  id?: ?$ElementType<Scalars, 'bigint'>,
  locality_id?: ?$ElementType<Scalars, 'bigint'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** input type for inserting data into table "locality" */
export type Locality_Insert_Input = {|
  children?: ?Locality_Arr_Rel_Insert_Input,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by?: ?$ElementType<Scalars, 'String'>,
  locality_id?: ?$ElementType<Scalars, 'bigint'>,
  name?: ?$ElementType<Scalars, 'String'>,
  parent?: ?Locality_Obj_Rel_Insert_Input,
  project?: ?Project_Obj_Rel_Insert_Input,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** aggregate max on columns */
export type Locality_Max_Fields = {|
  __typename?: 'locality_max_fields',
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by?: ?$ElementType<Scalars, 'String'>,
  locality_id?: ?$ElementType<Scalars, 'bigint'>,
  name?: ?$ElementType<Scalars, 'String'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** order by max() on columns of table "locality" */
export type Locality_Max_Order_By = {|
  created_at?: ?Order_By,
  created_by?: ?Order_By,
  description?: ?Order_By,
  id?: ?Order_By,
  last_updated_at?: ?Order_By,
  last_updated_by?: ?Order_By,
  locality_id?: ?Order_By,
  name?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate min on columns */
export type Locality_Min_Fields = {|
  __typename?: 'locality_min_fields',
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by?: ?$ElementType<Scalars, 'String'>,
  locality_id?: ?$ElementType<Scalars, 'bigint'>,
  name?: ?$ElementType<Scalars, 'String'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** order by min() on columns of table "locality" */
export type Locality_Min_Order_By = {|
  created_at?: ?Order_By,
  created_by?: ?Order_By,
  description?: ?Order_By,
  id?: ?Order_By,
  last_updated_at?: ?Order_By,
  last_updated_by?: ?Order_By,
  locality_id?: ?Order_By,
  name?: ?Order_By,
  project_id?: ?Order_By,
|};

/** response of any mutation on the table "locality" */
export type Locality_Mutation_Response = {|
  __typename?: 'locality_mutation_response',
  /** number of rows affected by the mutation */
  affected_rows: $ElementType<Scalars, 'Int'>,
  /** data from the rows affected by the mutation */
  returning: Array<Locality>,
|};

/** input type for inserting object relation for remote table "locality" */
export type Locality_Obj_Rel_Insert_Input = {|
  data: Locality_Insert_Input,
  /** on conflict condition */
  on_conflict?: ?Locality_On_Conflict,
|};

/** on conflict condition type for table "locality" */
export type Locality_On_Conflict = {|
  constraint: Locality_Constraint,
  update_columns: Array<Locality_Update_Column>,
  where?: ?Locality_Bool_Exp,
|};

/** Ordering options when selecting data from "locality". */
export type Locality_Order_By = {|
  children_aggregate?: ?Locality_Aggregate_Order_By,
  created_at?: ?Order_By,
  created_by?: ?Order_By,
  description?: ?Order_By,
  id?: ?Order_By,
  last_updated_at?: ?Order_By,
  last_updated_by?: ?Order_By,
  locality_id?: ?Order_By,
  name?: ?Order_By,
  parent?: ?Locality_Order_By,
  project?: ?Project_Order_By,
  project_id?: ?Order_By,
|};

/** primary key columns input for table: locality */
export type Locality_Pk_Columns_Input = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export const Locality_Select_ColumnValues = Object.freeze({
  /** column name */
  CreatedAt: 'created_at',
  /** column name */
  CreatedBy: 'created_by',
  /** column name */
  Description: 'description',
  /** column name */
  Id: 'id',
  /** column name */
  LastUpdatedAt: 'last_updated_at',
  /** column name */
  LastUpdatedBy: 'last_updated_by',
  /** column name */
  LocalityId: 'locality_id',
  /** column name */
  Name: 'name',
  /** column name */
  ProjectId: 'project_id',
});

/** select columns of table "locality" */
export type Locality_Select_Column = $Values<typeof Locality_Select_ColumnValues>;

/** input type for updating data in table "locality" */
export type Locality_Set_Input = {|
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by?: ?$ElementType<Scalars, 'String'>,
  locality_id?: ?$ElementType<Scalars, 'bigint'>,
  name?: ?$ElementType<Scalars, 'String'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** aggregate stddev on columns */
export type Locality_Stddev_Fields = {|
  __typename?: 'locality_stddev_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  locality_id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev() on columns of table "locality" */
export type Locality_Stddev_Order_By = {|
  id?: ?Order_By,
  locality_id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate stddev_pop on columns */
export type Locality_Stddev_Pop_Fields = {|
  __typename?: 'locality_stddev_pop_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  locality_id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev_pop() on columns of table "locality" */
export type Locality_Stddev_Pop_Order_By = {|
  id?: ?Order_By,
  locality_id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate stddev_samp on columns */
export type Locality_Stddev_Samp_Fields = {|
  __typename?: 'locality_stddev_samp_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  locality_id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev_samp() on columns of table "locality" */
export type Locality_Stddev_Samp_Order_By = {|
  id?: ?Order_By,
  locality_id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate sum on columns */
export type Locality_Sum_Fields = {|
  __typename?: 'locality_sum_fields',
  id?: ?$ElementType<Scalars, 'bigint'>,
  locality_id?: ?$ElementType<Scalars, 'bigint'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** order by sum() on columns of table "locality" */
export type Locality_Sum_Order_By = {|
  id?: ?Order_By,
  locality_id?: ?Order_By,
  project_id?: ?Order_By,
|};

export const Locality_Update_ColumnValues = Object.freeze({
  /** column name */
  CreatedAt: 'created_at',
  /** column name */
  CreatedBy: 'created_by',
  /** column name */
  Description: 'description',
  /** column name */
  Id: 'id',
  /** column name */
  LastUpdatedAt: 'last_updated_at',
  /** column name */
  LastUpdatedBy: 'last_updated_by',
  /** column name */
  LocalityId: 'locality_id',
  /** column name */
  Name: 'name',
  /** column name */
  ProjectId: 'project_id',
});

/** update columns of table "locality" */
export type Locality_Update_Column = $Values<typeof Locality_Update_ColumnValues>;

/** aggregate var_pop on columns */
export type Locality_Var_Pop_Fields = {|
  __typename?: 'locality_var_pop_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  locality_id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by var_pop() on columns of table "locality" */
export type Locality_Var_Pop_Order_By = {|
  id?: ?Order_By,
  locality_id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate var_samp on columns */
export type Locality_Var_Samp_Fields = {|
  __typename?: 'locality_var_samp_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  locality_id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by var_samp() on columns of table "locality" */
export type Locality_Var_Samp_Order_By = {|
  id?: ?Order_By,
  locality_id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate variance on columns */
export type Locality_Variance_Fields = {|
  __typename?: 'locality_variance_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  locality_id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by variance() on columns of table "locality" */
export type Locality_Variance_Order_By = {|
  id?: ?Order_By,
  locality_id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** columns and relationships of "member" */
export type Member = {|
  __typename?: 'member',
  accepted: $ElementType<Scalars, 'Boolean'>,
  accepted_at?: ?$ElementType<Scalars, 'timestamptz'>,
  accepted_by: $ElementType<Scalars, 'String'>,
  /** An object relationship */
  accepting: Auth0_User,
  auth0_user_id?: ?$ElementType<Scalars, 'String'>,
  created_at: $ElementType<Scalars, 'timestamptz'>,
  created_by: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'bigint'>,
  /** An array relationship */
  permissions: Array<Member_Permissions_View>,
  /** An aggregate relationship */
  permissions_aggregate: Member_Permissions_View_Aggregate,
  /** An object relationship */
  project: Project,
  project_id: $ElementType<Scalars, 'bigint'>,
  project_token: $ElementType<Scalars, 'bpchar'>,
  /** An object relationship */
  user?: ?Auth0_User,
|};

/** columns and relationships of "member" */
export type MemberPermissionsArgs = {|
  distinct_on?: ?Array<Member_Permissions_View_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Permissions_View_Order_By>,
  where?: ?Member_Permissions_View_Bool_Exp,
|};

/** columns and relationships of "member" */
export type MemberPermissions_AggregateArgs = {|
  distinct_on?: ?Array<Member_Permissions_View_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Permissions_View_Order_By>,
  where?: ?Member_Permissions_View_Bool_Exp,
|};

/** aggregated selection of "member" */
export type Member_Aggregate = {|
  __typename?: 'member_aggregate',
  aggregate?: ?Member_Aggregate_Fields,
  nodes: Array<Member>,
|};

/** aggregate fields of "member" */
export type Member_Aggregate_Fields = {|
  __typename?: 'member_aggregate_fields',
  avg?: ?Member_Avg_Fields,
  count: $ElementType<Scalars, 'Int'>,
  max?: ?Member_Max_Fields,
  min?: ?Member_Min_Fields,
  stddev?: ?Member_Stddev_Fields,
  stddev_pop?: ?Member_Stddev_Pop_Fields,
  stddev_samp?: ?Member_Stddev_Samp_Fields,
  sum?: ?Member_Sum_Fields,
  var_pop?: ?Member_Var_Pop_Fields,
  var_samp?: ?Member_Var_Samp_Fields,
  variance?: ?Member_Variance_Fields,
|};

/** aggregate fields of "member" */
export type Member_Aggregate_FieldsCountArgs = {|
  columns?: ?Array<Member_Select_Column>,
  distinct?: ?$ElementType<Scalars, 'Boolean'>,
|};

/** order by aggregate values of table "member" */
export type Member_Aggregate_Order_By = {|
  avg?: ?Member_Avg_Order_By,
  count?: ?Order_By,
  max?: ?Member_Max_Order_By,
  min?: ?Member_Min_Order_By,
  stddev?: ?Member_Stddev_Order_By,
  stddev_pop?: ?Member_Stddev_Pop_Order_By,
  stddev_samp?: ?Member_Stddev_Samp_Order_By,
  sum?: ?Member_Sum_Order_By,
  var_pop?: ?Member_Var_Pop_Order_By,
  var_samp?: ?Member_Var_Samp_Order_By,
  variance?: ?Member_Variance_Order_By,
|};

/** input type for inserting array relation for remote table "member" */
export type Member_Arr_Rel_Insert_Input = {|
  data: Array<Member_Insert_Input>,
  /** on conflict condition */
  on_conflict?: ?Member_On_Conflict,
|};

/** aggregate avg on columns */
export type Member_Avg_Fields = {|
  __typename?: 'member_avg_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by avg() on columns of table "member" */
export type Member_Avg_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** Boolean expression to filter rows from the table "member". All fields are combined with a logical 'AND'. */
export type Member_Bool_Exp = {|
  _and?: ?Array<Member_Bool_Exp>,
  _not?: ?Member_Bool_Exp,
  _or?: ?Array<Member_Bool_Exp>,
  accepted?: ?Boolean_Comparison_Exp,
  accepted_at?: ?Timestamptz_Comparison_Exp,
  accepted_by?: ?String_Comparison_Exp,
  accepting?: ?Auth0_User_Bool_Exp,
  auth0_user_id?: ?String_Comparison_Exp,
  created_at?: ?Timestamptz_Comparison_Exp,
  created_by?: ?String_Comparison_Exp,
  id?: ?Bigint_Comparison_Exp,
  permissions?: ?Member_Permissions_View_Bool_Exp,
  project?: ?Project_Bool_Exp,
  project_id?: ?Bigint_Comparison_Exp,
  project_token?: ?Bpchar_Comparison_Exp,
  user?: ?Auth0_User_Bool_Exp,
|};

export const Member_ConstraintValues = Object.freeze({
  /** unique or primary key constraint */
  MemberPkey: 'member_pkey',
  /** unique or primary key constraint */
  UniqueInvitation: 'unique_invitation',
});

/** unique or primary key constraints on table "member" */
export type Member_Constraint = $Values<typeof Member_ConstraintValues>;

/** input type for incrementing numeric columns in table "member" */
export type Member_Inc_Input = {|
  id?: ?$ElementType<Scalars, 'bigint'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** input type for inserting data into table "member" */
export type Member_Insert_Input = {|
  accepted?: ?$ElementType<Scalars, 'Boolean'>,
  accepted_at?: ?$ElementType<Scalars, 'timestamptz'>,
  accepted_by?: ?$ElementType<Scalars, 'String'>,
  accepting?: ?Auth0_User_Obj_Rel_Insert_Input,
  auth0_user_id?: ?$ElementType<Scalars, 'String'>,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  permissions?: ?Member_Permissions_View_Arr_Rel_Insert_Input,
  project?: ?Project_Obj_Rel_Insert_Input,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
  project_token?: ?$ElementType<Scalars, 'bpchar'>,
  user?: ?Auth0_User_Obj_Rel_Insert_Input,
|};

/** aggregate max on columns */
export type Member_Max_Fields = {|
  __typename?: 'member_max_fields',
  accepted_at?: ?$ElementType<Scalars, 'timestamptz'>,
  accepted_by?: ?$ElementType<Scalars, 'String'>,
  auth0_user_id?: ?$ElementType<Scalars, 'String'>,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
  project_token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** order by max() on columns of table "member" */
export type Member_Max_Order_By = {|
  accepted_at?: ?Order_By,
  accepted_by?: ?Order_By,
  auth0_user_id?: ?Order_By,
  created_at?: ?Order_By,
  created_by?: ?Order_By,
  id?: ?Order_By,
  project_id?: ?Order_By,
  project_token?: ?Order_By,
|};

/** aggregate min on columns */
export type Member_Min_Fields = {|
  __typename?: 'member_min_fields',
  accepted_at?: ?$ElementType<Scalars, 'timestamptz'>,
  accepted_by?: ?$ElementType<Scalars, 'String'>,
  auth0_user_id?: ?$ElementType<Scalars, 'String'>,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
  project_token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** order by min() on columns of table "member" */
export type Member_Min_Order_By = {|
  accepted_at?: ?Order_By,
  accepted_by?: ?Order_By,
  auth0_user_id?: ?Order_By,
  created_at?: ?Order_By,
  created_by?: ?Order_By,
  id?: ?Order_By,
  project_id?: ?Order_By,
  project_token?: ?Order_By,
|};

/** response of any mutation on the table "member" */
export type Member_Mutation_Response = {|
  __typename?: 'member_mutation_response',
  /** number of rows affected by the mutation */
  affected_rows: $ElementType<Scalars, 'Int'>,
  /** data from the rows affected by the mutation */
  returning: Array<Member>,
|};

/** on conflict condition type for table "member" */
export type Member_On_Conflict = {|
  constraint: Member_Constraint,
  update_columns: Array<Member_Update_Column>,
  where?: ?Member_Bool_Exp,
|};

/** Ordering options when selecting data from "member". */
export type Member_Order_By = {|
  accepted?: ?Order_By,
  accepted_at?: ?Order_By,
  accepted_by?: ?Order_By,
  accepting?: ?Auth0_User_Order_By,
  auth0_user_id?: ?Order_By,
  created_at?: ?Order_By,
  created_by?: ?Order_By,
  id?: ?Order_By,
  permissions_aggregate?: ?Member_Permissions_View_Aggregate_Order_By,
  project?: ?Project_Order_By,
  project_id?: ?Order_By,
  project_token?: ?Order_By,
  user?: ?Auth0_User_Order_By,
|};

/** columns and relationships of "member_permissions_view" */
export type Member_Permissions_View = {|
  __typename?: 'member_permissions_view',
  permission?: ?$ElementType<Scalars, 'String'>,
  user_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** aggregated selection of "member_permissions_view" */
export type Member_Permissions_View_Aggregate = {|
  __typename?: 'member_permissions_view_aggregate',
  aggregate?: ?Member_Permissions_View_Aggregate_Fields,
  nodes: Array<Member_Permissions_View>,
|};

/** aggregate fields of "member_permissions_view" */
export type Member_Permissions_View_Aggregate_Fields = {|
  __typename?: 'member_permissions_view_aggregate_fields',
  avg?: ?Member_Permissions_View_Avg_Fields,
  count: $ElementType<Scalars, 'Int'>,
  max?: ?Member_Permissions_View_Max_Fields,
  min?: ?Member_Permissions_View_Min_Fields,
  stddev?: ?Member_Permissions_View_Stddev_Fields,
  stddev_pop?: ?Member_Permissions_View_Stddev_Pop_Fields,
  stddev_samp?: ?Member_Permissions_View_Stddev_Samp_Fields,
  sum?: ?Member_Permissions_View_Sum_Fields,
  var_pop?: ?Member_Permissions_View_Var_Pop_Fields,
  var_samp?: ?Member_Permissions_View_Var_Samp_Fields,
  variance?: ?Member_Permissions_View_Variance_Fields,
|};

/** aggregate fields of "member_permissions_view" */
export type Member_Permissions_View_Aggregate_FieldsCountArgs = {|
  columns?: ?Array<Member_Permissions_View_Select_Column>,
  distinct?: ?$ElementType<Scalars, 'Boolean'>,
|};

/** order by aggregate values of table "member_permissions_view" */
export type Member_Permissions_View_Aggregate_Order_By = {|
  avg?: ?Member_Permissions_View_Avg_Order_By,
  count?: ?Order_By,
  max?: ?Member_Permissions_View_Max_Order_By,
  min?: ?Member_Permissions_View_Min_Order_By,
  stddev?: ?Member_Permissions_View_Stddev_Order_By,
  stddev_pop?: ?Member_Permissions_View_Stddev_Pop_Order_By,
  stddev_samp?: ?Member_Permissions_View_Stddev_Samp_Order_By,
  sum?: ?Member_Permissions_View_Sum_Order_By,
  var_pop?: ?Member_Permissions_View_Var_Pop_Order_By,
  var_samp?: ?Member_Permissions_View_Var_Samp_Order_By,
  variance?: ?Member_Permissions_View_Variance_Order_By,
|};

/** input type for inserting array relation for remote table "member_permissions_view" */
export type Member_Permissions_View_Arr_Rel_Insert_Input = {|
  data: Array<Member_Permissions_View_Insert_Input>,
|};

/** aggregate avg on columns */
export type Member_Permissions_View_Avg_Fields = {|
  __typename?: 'member_permissions_view_avg_fields',
  user_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by avg() on columns of table "member_permissions_view" */
export type Member_Permissions_View_Avg_Order_By = {|
  user_id?: ?Order_By,
|};

/** Boolean expression to filter rows from the table "member_permissions_view". All fields are combined with a logical 'AND'. */
export type Member_Permissions_View_Bool_Exp = {|
  _and?: ?Array<Member_Permissions_View_Bool_Exp>,
  _not?: ?Member_Permissions_View_Bool_Exp,
  _or?: ?Array<Member_Permissions_View_Bool_Exp>,
  permission?: ?String_Comparison_Exp,
  user_id?: ?Bigint_Comparison_Exp,
|};

/** input type for inserting data into table "member_permissions_view" */
export type Member_Permissions_View_Insert_Input = {|
  permission?: ?$ElementType<Scalars, 'String'>,
  user_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** aggregate max on columns */
export type Member_Permissions_View_Max_Fields = {|
  __typename?: 'member_permissions_view_max_fields',
  permission?: ?$ElementType<Scalars, 'String'>,
  user_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** order by max() on columns of table "member_permissions_view" */
export type Member_Permissions_View_Max_Order_By = {|
  permission?: ?Order_By,
  user_id?: ?Order_By,
|};

/** aggregate min on columns */
export type Member_Permissions_View_Min_Fields = {|
  __typename?: 'member_permissions_view_min_fields',
  permission?: ?$ElementType<Scalars, 'String'>,
  user_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** order by min() on columns of table "member_permissions_view" */
export type Member_Permissions_View_Min_Order_By = {|
  permission?: ?Order_By,
  user_id?: ?Order_By,
|};

/** Ordering options when selecting data from "member_permissions_view". */
export type Member_Permissions_View_Order_By = {|
  permission?: ?Order_By,
  user_id?: ?Order_By,
|};

export const Member_Permissions_View_Select_ColumnValues = Object.freeze({
  /** column name */
  Permission: 'permission',
  /** column name */
  UserId: 'user_id',
});

/** select columns of table "member_permissions_view" */
export type Member_Permissions_View_Select_Column = $Values<typeof Member_Permissions_View_Select_ColumnValues>;

/** aggregate stddev on columns */
export type Member_Permissions_View_Stddev_Fields = {|
  __typename?: 'member_permissions_view_stddev_fields',
  user_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev() on columns of table "member_permissions_view" */
export type Member_Permissions_View_Stddev_Order_By = {|
  user_id?: ?Order_By,
|};

/** aggregate stddev_pop on columns */
export type Member_Permissions_View_Stddev_Pop_Fields = {|
  __typename?: 'member_permissions_view_stddev_pop_fields',
  user_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev_pop() on columns of table "member_permissions_view" */
export type Member_Permissions_View_Stddev_Pop_Order_By = {|
  user_id?: ?Order_By,
|};

/** aggregate stddev_samp on columns */
export type Member_Permissions_View_Stddev_Samp_Fields = {|
  __typename?: 'member_permissions_view_stddev_samp_fields',
  user_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev_samp() on columns of table "member_permissions_view" */
export type Member_Permissions_View_Stddev_Samp_Order_By = {|
  user_id?: ?Order_By,
|};

/** aggregate sum on columns */
export type Member_Permissions_View_Sum_Fields = {|
  __typename?: 'member_permissions_view_sum_fields',
  user_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** order by sum() on columns of table "member_permissions_view" */
export type Member_Permissions_View_Sum_Order_By = {|
  user_id?: ?Order_By,
|};

/** aggregate var_pop on columns */
export type Member_Permissions_View_Var_Pop_Fields = {|
  __typename?: 'member_permissions_view_var_pop_fields',
  user_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by var_pop() on columns of table "member_permissions_view" */
export type Member_Permissions_View_Var_Pop_Order_By = {|
  user_id?: ?Order_By,
|};

/** aggregate var_samp on columns */
export type Member_Permissions_View_Var_Samp_Fields = {|
  __typename?: 'member_permissions_view_var_samp_fields',
  user_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by var_samp() on columns of table "member_permissions_view" */
export type Member_Permissions_View_Var_Samp_Order_By = {|
  user_id?: ?Order_By,
|};

/** aggregate variance on columns */
export type Member_Permissions_View_Variance_Fields = {|
  __typename?: 'member_permissions_view_variance_fields',
  user_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by variance() on columns of table "member_permissions_view" */
export type Member_Permissions_View_Variance_Order_By = {|
  user_id?: ?Order_By,
|};

/** primary key columns input for table: member */
export type Member_Pk_Columns_Input = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export const Member_Select_ColumnValues = Object.freeze({
  /** column name */
  Accepted: 'accepted',
  /** column name */
  AcceptedAt: 'accepted_at',
  /** column name */
  AcceptedBy: 'accepted_by',
  /** column name */
  Auth0UserId: 'auth0_user_id',
  /** column name */
  CreatedAt: 'created_at',
  /** column name */
  CreatedBy: 'created_by',
  /** column name */
  Id: 'id',
  /** column name */
  ProjectId: 'project_id',
  /** column name */
  ProjectToken: 'project_token',
});

/** select columns of table "member" */
export type Member_Select_Column = $Values<typeof Member_Select_ColumnValues>;

/** input type for updating data in table "member" */
export type Member_Set_Input = {|
  accepted?: ?$ElementType<Scalars, 'Boolean'>,
  accepted_at?: ?$ElementType<Scalars, 'timestamptz'>,
  accepted_by?: ?$ElementType<Scalars, 'String'>,
  auth0_user_id?: ?$ElementType<Scalars, 'String'>,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
  project_token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** aggregate stddev on columns */
export type Member_Stddev_Fields = {|
  __typename?: 'member_stddev_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev() on columns of table "member" */
export type Member_Stddev_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate stddev_pop on columns */
export type Member_Stddev_Pop_Fields = {|
  __typename?: 'member_stddev_pop_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev_pop() on columns of table "member" */
export type Member_Stddev_Pop_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate stddev_samp on columns */
export type Member_Stddev_Samp_Fields = {|
  __typename?: 'member_stddev_samp_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev_samp() on columns of table "member" */
export type Member_Stddev_Samp_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate sum on columns */
export type Member_Sum_Fields = {|
  __typename?: 'member_sum_fields',
  id?: ?$ElementType<Scalars, 'bigint'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** order by sum() on columns of table "member" */
export type Member_Sum_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

export const Member_Update_ColumnValues = Object.freeze({
  /** column name */
  Accepted: 'accepted',
  /** column name */
  AcceptedAt: 'accepted_at',
  /** column name */
  AcceptedBy: 'accepted_by',
  /** column name */
  Auth0UserId: 'auth0_user_id',
  /** column name */
  CreatedAt: 'created_at',
  /** column name */
  CreatedBy: 'created_by',
  /** column name */
  Id: 'id',
  /** column name */
  ProjectId: 'project_id',
  /** column name */
  ProjectToken: 'project_token',
});

/** update columns of table "member" */
export type Member_Update_Column = $Values<typeof Member_Update_ColumnValues>;

/** aggregate var_pop on columns */
export type Member_Var_Pop_Fields = {|
  __typename?: 'member_var_pop_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by var_pop() on columns of table "member" */
export type Member_Var_Pop_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate var_samp on columns */
export type Member_Var_Samp_Fields = {|
  __typename?: 'member_var_samp_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by var_samp() on columns of table "member" */
export type Member_Var_Samp_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate variance on columns */
export type Member_Variance_Fields = {|
  __typename?: 'member_variance_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by variance() on columns of table "member" */
export type Member_Variance_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** mutation root */
export type Mutation_Root = {|
  __typename?: 'mutation_root',
  /** delete data from the table: "auth0_user" */
  delete_auth0_user?: ?Auth0_User_Mutation_Response,
  /** delete single row from the table: "auth0_user" */
  delete_auth0_user_by_pk?: ?Auth0_User,
  /** delete data from the table: "locality" */
  delete_locality?: ?Locality_Mutation_Response,
  /** delete single row from the table: "locality" */
  delete_locality_by_pk?: ?Locality,
  /** delete data from the table: "member" */
  delete_member?: ?Member_Mutation_Response,
  /** delete single row from the table: "member" */
  delete_member_by_pk?: ?Member,
  /** delete data from the table: "permission" */
  delete_permission?: ?Permission_Mutation_Response,
  /** delete single row from the table: "permission" */
  delete_permission_by_pk?: ?Permission,
  /** delete data from the table: "project" */
  delete_project?: ?Project_Mutation_Response,
  /** delete single row from the table: "project" */
  delete_project_by_pk?: ?Project,
  /** insert data into the table: "auth0_user" */
  insert_auth0_user?: ?Auth0_User_Mutation_Response,
  /** insert a single row into the table: "auth0_user" */
  insert_auth0_user_one?: ?Auth0_User,
  /** insert data into the table: "locality" */
  insert_locality?: ?Locality_Mutation_Response,
  /** insert a single row into the table: "locality" */
  insert_locality_one?: ?Locality,
  /** insert data into the table: "member" */
  insert_member?: ?Member_Mutation_Response,
  /** insert a single row into the table: "member" */
  insert_member_one?: ?Member,
  /** insert data into the table: "permission" */
  insert_permission?: ?Permission_Mutation_Response,
  /** insert a single row into the table: "permission" */
  insert_permission_one?: ?Permission,
  /** insert data into the table: "project" */
  insert_project?: ?Project_Mutation_Response,
  /** insert a single row into the table: "project" */
  insert_project_one?: ?Project,
  /** update data of the table: "auth0_user" */
  update_auth0_user?: ?Auth0_User_Mutation_Response,
  /** update single row of the table: "auth0_user" */
  update_auth0_user_by_pk?: ?Auth0_User,
  /** update data of the table: "locality" */
  update_locality?: ?Locality_Mutation_Response,
  /** update single row of the table: "locality" */
  update_locality_by_pk?: ?Locality,
  /** update data of the table: "member" */
  update_member?: ?Member_Mutation_Response,
  /** update single row of the table: "member" */
  update_member_by_pk?: ?Member,
  /** update data of the table: "permission" */
  update_permission?: ?Permission_Mutation_Response,
  /** update single row of the table: "permission" */
  update_permission_by_pk?: ?Permission,
  /** update data of the table: "project" */
  update_project?: ?Project_Mutation_Response,
  /** update single row of the table: "project" */
  update_project_by_pk?: ?Project,
|};

/** mutation root */
export type Mutation_RootDelete_Auth0_UserArgs = {|
  where: Auth0_User_Bool_Exp,
|};

/** mutation root */
export type Mutation_RootDelete_Auth0_User_By_PkArgs = {|
  user_id: $ElementType<Scalars, 'String'>,
|};

/** mutation root */
export type Mutation_RootDelete_LocalityArgs = {|
  where: Locality_Bool_Exp,
|};

/** mutation root */
export type Mutation_RootDelete_Locality_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

/** mutation root */
export type Mutation_RootDelete_MemberArgs = {|
  where: Member_Bool_Exp,
|};

/** mutation root */
export type Mutation_RootDelete_Member_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

/** mutation root */
export type Mutation_RootDelete_PermissionArgs = {|
  where: Permission_Bool_Exp,
|};

/** mutation root */
export type Mutation_RootDelete_Permission_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

/** mutation root */
export type Mutation_RootDelete_ProjectArgs = {|
  where: Project_Bool_Exp,
|};

/** mutation root */
export type Mutation_RootDelete_Project_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

/** mutation root */
export type Mutation_RootInsert_Auth0_UserArgs = {|
  objects: Array<Auth0_User_Insert_Input>,
  on_conflict?: ?Auth0_User_On_Conflict,
|};

/** mutation root */
export type Mutation_RootInsert_Auth0_User_OneArgs = {|
  object: Auth0_User_Insert_Input,
  on_conflict?: ?Auth0_User_On_Conflict,
|};

/** mutation root */
export type Mutation_RootInsert_LocalityArgs = {|
  objects: Array<Locality_Insert_Input>,
  on_conflict?: ?Locality_On_Conflict,
|};

/** mutation root */
export type Mutation_RootInsert_Locality_OneArgs = {|
  object: Locality_Insert_Input,
  on_conflict?: ?Locality_On_Conflict,
|};

/** mutation root */
export type Mutation_RootInsert_MemberArgs = {|
  objects: Array<Member_Insert_Input>,
  on_conflict?: ?Member_On_Conflict,
|};

/** mutation root */
export type Mutation_RootInsert_Member_OneArgs = {|
  object: Member_Insert_Input,
  on_conflict?: ?Member_On_Conflict,
|};

/** mutation root */
export type Mutation_RootInsert_PermissionArgs = {|
  objects: Array<Permission_Insert_Input>,
  on_conflict?: ?Permission_On_Conflict,
|};

/** mutation root */
export type Mutation_RootInsert_Permission_OneArgs = {|
  object: Permission_Insert_Input,
  on_conflict?: ?Permission_On_Conflict,
|};

/** mutation root */
export type Mutation_RootInsert_ProjectArgs = {|
  objects: Array<Project_Insert_Input>,
  on_conflict?: ?Project_On_Conflict,
|};

/** mutation root */
export type Mutation_RootInsert_Project_OneArgs = {|
  object: Project_Insert_Input,
  on_conflict?: ?Project_On_Conflict,
|};

/** mutation root */
export type Mutation_RootUpdate_Auth0_UserArgs = {|
  _set?: ?Auth0_User_Set_Input,
  where: Auth0_User_Bool_Exp,
|};

/** mutation root */
export type Mutation_RootUpdate_Auth0_User_By_PkArgs = {|
  _set?: ?Auth0_User_Set_Input,
  pk_columns: Auth0_User_Pk_Columns_Input,
|};

/** mutation root */
export type Mutation_RootUpdate_LocalityArgs = {|
  _inc?: ?Locality_Inc_Input,
  _set?: ?Locality_Set_Input,
  where: Locality_Bool_Exp,
|};

/** mutation root */
export type Mutation_RootUpdate_Locality_By_PkArgs = {|
  _inc?: ?Locality_Inc_Input,
  _set?: ?Locality_Set_Input,
  pk_columns: Locality_Pk_Columns_Input,
|};

/** mutation root */
export type Mutation_RootUpdate_MemberArgs = {|
  _inc?: ?Member_Inc_Input,
  _set?: ?Member_Set_Input,
  where: Member_Bool_Exp,
|};

/** mutation root */
export type Mutation_RootUpdate_Member_By_PkArgs = {|
  _inc?: ?Member_Inc_Input,
  _set?: ?Member_Set_Input,
  pk_columns: Member_Pk_Columns_Input,
|};

/** mutation root */
export type Mutation_RootUpdate_PermissionArgs = {|
  _inc?: ?Permission_Inc_Input,
  _set?: ?Permission_Set_Input,
  where: Permission_Bool_Exp,
|};

/** mutation root */
export type Mutation_RootUpdate_Permission_By_PkArgs = {|
  _inc?: ?Permission_Inc_Input,
  _set?: ?Permission_Set_Input,
  pk_columns: Permission_Pk_Columns_Input,
|};

/** mutation root */
export type Mutation_RootUpdate_ProjectArgs = {|
  _inc?: ?Project_Inc_Input,
  _set?: ?Project_Set_Input,
  where: Project_Bool_Exp,
|};

/** mutation root */
export type Mutation_RootUpdate_Project_By_PkArgs = {|
  _inc?: ?Project_Inc_Input,
  _set?: ?Project_Set_Input,
  pk_columns: Project_Pk_Columns_Input,
|};

export const Order_ByValues = Object.freeze({
  /** in ascending order, nulls last */
  Asc: 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst: 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast: 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc: 'desc',
  /** in descending order, nulls first */
  DescNullsFirst: 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast: 'desc_nulls_last',
});

/** column ordering options */
export type Order_By = $Values<typeof Order_ByValues>;

/** columns and relationships of "permission" */
export type Permission = {|
  __typename?: 'permission',
  id: $ElementType<Scalars, 'bigint'>,
  name: $ElementType<Scalars, 'String'>,
|};

/** aggregated selection of "permission" */
export type Permission_Aggregate = {|
  __typename?: 'permission_aggregate',
  aggregate?: ?Permission_Aggregate_Fields,
  nodes: Array<Permission>,
|};

/** aggregate fields of "permission" */
export type Permission_Aggregate_Fields = {|
  __typename?: 'permission_aggregate_fields',
  avg?: ?Permission_Avg_Fields,
  count: $ElementType<Scalars, 'Int'>,
  max?: ?Permission_Max_Fields,
  min?: ?Permission_Min_Fields,
  stddev?: ?Permission_Stddev_Fields,
  stddev_pop?: ?Permission_Stddev_Pop_Fields,
  stddev_samp?: ?Permission_Stddev_Samp_Fields,
  sum?: ?Permission_Sum_Fields,
  var_pop?: ?Permission_Var_Pop_Fields,
  var_samp?: ?Permission_Var_Samp_Fields,
  variance?: ?Permission_Variance_Fields,
|};

/** aggregate fields of "permission" */
export type Permission_Aggregate_FieldsCountArgs = {|
  columns?: ?Array<Permission_Select_Column>,
  distinct?: ?$ElementType<Scalars, 'Boolean'>,
|};

/** aggregate avg on columns */
export type Permission_Avg_Fields = {|
  __typename?: 'permission_avg_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** Boolean expression to filter rows from the table "permission". All fields are combined with a logical 'AND'. */
export type Permission_Bool_Exp = {|
  _and?: ?Array<Permission_Bool_Exp>,
  _not?: ?Permission_Bool_Exp,
  _or?: ?Array<Permission_Bool_Exp>,
  id?: ?Bigint_Comparison_Exp,
  name?: ?String_Comparison_Exp,
|};

export const Permission_ConstraintValues = Object.freeze({
  /** unique or primary key constraint */
  PermissionPkey: 'permission_pkey',
});

/** unique or primary key constraints on table "permission" */
export type Permission_Constraint = $Values<typeof Permission_ConstraintValues>;

/** input type for incrementing numeric columns in table "permission" */
export type Permission_Inc_Input = {|
  id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** input type for inserting data into table "permission" */
export type Permission_Insert_Input = {|
  id?: ?$ElementType<Scalars, 'bigint'>,
  name?: ?$ElementType<Scalars, 'String'>,
|};

/** aggregate max on columns */
export type Permission_Max_Fields = {|
  __typename?: 'permission_max_fields',
  id?: ?$ElementType<Scalars, 'bigint'>,
  name?: ?$ElementType<Scalars, 'String'>,
|};

/** aggregate min on columns */
export type Permission_Min_Fields = {|
  __typename?: 'permission_min_fields',
  id?: ?$ElementType<Scalars, 'bigint'>,
  name?: ?$ElementType<Scalars, 'String'>,
|};

/** response of any mutation on the table "permission" */
export type Permission_Mutation_Response = {|
  __typename?: 'permission_mutation_response',
  /** number of rows affected by the mutation */
  affected_rows: $ElementType<Scalars, 'Int'>,
  /** data from the rows affected by the mutation */
  returning: Array<Permission>,
|};

/** on conflict condition type for table "permission" */
export type Permission_On_Conflict = {|
  constraint: Permission_Constraint,
  update_columns: Array<Permission_Update_Column>,
  where?: ?Permission_Bool_Exp,
|};

/** Ordering options when selecting data from "permission". */
export type Permission_Order_By = {|
  id?: ?Order_By,
  name?: ?Order_By,
|};

/** primary key columns input for table: permission */
export type Permission_Pk_Columns_Input = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export const Permission_Select_ColumnValues = Object.freeze({
  /** column name */
  Id: 'id',
  /** column name */
  Name: 'name',
});

/** select columns of table "permission" */
export type Permission_Select_Column = $Values<typeof Permission_Select_ColumnValues>;

/** input type for updating data in table "permission" */
export type Permission_Set_Input = {|
  id?: ?$ElementType<Scalars, 'bigint'>,
  name?: ?$ElementType<Scalars, 'String'>,
|};

/** aggregate stddev on columns */
export type Permission_Stddev_Fields = {|
  __typename?: 'permission_stddev_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** aggregate stddev_pop on columns */
export type Permission_Stddev_Pop_Fields = {|
  __typename?: 'permission_stddev_pop_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** aggregate stddev_samp on columns */
export type Permission_Stddev_Samp_Fields = {|
  __typename?: 'permission_stddev_samp_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** aggregate sum on columns */
export type Permission_Sum_Fields = {|
  __typename?: 'permission_sum_fields',
  id?: ?$ElementType<Scalars, 'bigint'>,
|};

export const Permission_Update_ColumnValues = Object.freeze({
  /** column name */
  Id: 'id',
  /** column name */
  Name: 'name',
});

/** update columns of table "permission" */
export type Permission_Update_Column = $Values<typeof Permission_Update_ColumnValues>;

/** aggregate var_pop on columns */
export type Permission_Var_Pop_Fields = {|
  __typename?: 'permission_var_pop_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** aggregate var_samp on columns */
export type Permission_Var_Samp_Fields = {|
  __typename?: 'permission_var_samp_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** aggregate variance on columns */
export type Permission_Variance_Fields = {|
  __typename?: 'permission_variance_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** columns and relationships of "project" */
export type Project = {|
  __typename?: 'project',
  archived: $ElementType<Scalars, 'Boolean'>,
  created_at: $ElementType<Scalars, 'timestamptz'>,
  created_by: $ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  end_time?: ?$ElementType<Scalars, 'timestamptz'>,
  id: $ElementType<Scalars, 'bigint'>,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by: $ElementType<Scalars, 'String'>,
  /** An array relationship */
  localities: Array<Locality>,
  /** An aggregate relationship */
  localities_aggregate: Locality_Aggregate,
  /** An array relationship */
  members: Array<Member>,
  /** An aggregate relationship */
  members_aggregate: Member_Aggregate,
  name: $ElementType<Scalars, 'String'>,
  start_time?: ?$ElementType<Scalars, 'timestamptz'>,
  token: $ElementType<Scalars, 'bpchar'>,
|};

/** columns and relationships of "project" */
export type ProjectLocalitiesArgs = {|
  distinct_on?: ?Array<Locality_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Locality_Order_By>,
  where?: ?Locality_Bool_Exp,
|};

/** columns and relationships of "project" */
export type ProjectLocalities_AggregateArgs = {|
  distinct_on?: ?Array<Locality_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Locality_Order_By>,
  where?: ?Locality_Bool_Exp,
|};

/** columns and relationships of "project" */
export type ProjectMembersArgs = {|
  distinct_on?: ?Array<Member_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Order_By>,
  where?: ?Member_Bool_Exp,
|};

/** columns and relationships of "project" */
export type ProjectMembers_AggregateArgs = {|
  distinct_on?: ?Array<Member_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Order_By>,
  where?: ?Member_Bool_Exp,
|};

/** aggregated selection of "project" */
export type Project_Aggregate = {|
  __typename?: 'project_aggregate',
  aggregate?: ?Project_Aggregate_Fields,
  nodes: Array<Project>,
|};

/** aggregate fields of "project" */
export type Project_Aggregate_Fields = {|
  __typename?: 'project_aggregate_fields',
  avg?: ?Project_Avg_Fields,
  count: $ElementType<Scalars, 'Int'>,
  max?: ?Project_Max_Fields,
  min?: ?Project_Min_Fields,
  stddev?: ?Project_Stddev_Fields,
  stddev_pop?: ?Project_Stddev_Pop_Fields,
  stddev_samp?: ?Project_Stddev_Samp_Fields,
  sum?: ?Project_Sum_Fields,
  var_pop?: ?Project_Var_Pop_Fields,
  var_samp?: ?Project_Var_Samp_Fields,
  variance?: ?Project_Variance_Fields,
|};

/** aggregate fields of "project" */
export type Project_Aggregate_FieldsCountArgs = {|
  columns?: ?Array<Project_Select_Column>,
  distinct?: ?$ElementType<Scalars, 'Boolean'>,
|};

/** aggregate avg on columns */
export type Project_Avg_Fields = {|
  __typename?: 'project_avg_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** Boolean expression to filter rows from the table "project". All fields are combined with a logical 'AND'. */
export type Project_Bool_Exp = {|
  _and?: ?Array<Project_Bool_Exp>,
  _not?: ?Project_Bool_Exp,
  _or?: ?Array<Project_Bool_Exp>,
  archived?: ?Boolean_Comparison_Exp,
  created_at?: ?Timestamptz_Comparison_Exp,
  created_by?: ?String_Comparison_Exp,
  description?: ?String_Comparison_Exp,
  end_time?: ?Timestamptz_Comparison_Exp,
  id?: ?Bigint_Comparison_Exp,
  last_updated_at?: ?Timestamptz_Comparison_Exp,
  last_updated_by?: ?String_Comparison_Exp,
  localities?: ?Locality_Bool_Exp,
  members?: ?Member_Bool_Exp,
  name?: ?String_Comparison_Exp,
  start_time?: ?Timestamptz_Comparison_Exp,
  token?: ?Bpchar_Comparison_Exp,
|};

export const Project_ConstraintValues = Object.freeze({
  /** unique or primary key constraint */
  ProjectPkey: 'project_pkey',
  /** unique or primary key constraint */
  UniqueToken: 'unique_token',
});

/** unique or primary key constraints on table "project" */
export type Project_Constraint = $Values<typeof Project_ConstraintValues>;

/** input type for incrementing numeric columns in table "project" */
export type Project_Inc_Input = {|
  id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** input type for inserting data into table "project" */
export type Project_Insert_Input = {|
  archived?: ?$ElementType<Scalars, 'Boolean'>,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  end_time?: ?$ElementType<Scalars, 'timestamptz'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by?: ?$ElementType<Scalars, 'String'>,
  localities?: ?Locality_Arr_Rel_Insert_Input,
  members?: ?Member_Arr_Rel_Insert_Input,
  name?: ?$ElementType<Scalars, 'String'>,
  start_time?: ?$ElementType<Scalars, 'timestamptz'>,
  token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** aggregate max on columns */
export type Project_Max_Fields = {|
  __typename?: 'project_max_fields',
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  end_time?: ?$ElementType<Scalars, 'timestamptz'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by?: ?$ElementType<Scalars, 'String'>,
  name?: ?$ElementType<Scalars, 'String'>,
  start_time?: ?$ElementType<Scalars, 'timestamptz'>,
  token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** aggregate min on columns */
export type Project_Min_Fields = {|
  __typename?: 'project_min_fields',
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  end_time?: ?$ElementType<Scalars, 'timestamptz'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by?: ?$ElementType<Scalars, 'String'>,
  name?: ?$ElementType<Scalars, 'String'>,
  start_time?: ?$ElementType<Scalars, 'timestamptz'>,
  token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** response of any mutation on the table "project" */
export type Project_Mutation_Response = {|
  __typename?: 'project_mutation_response',
  /** number of rows affected by the mutation */
  affected_rows: $ElementType<Scalars, 'Int'>,
  /** data from the rows affected by the mutation */
  returning: Array<Project>,
|};

/** input type for inserting object relation for remote table "project" */
export type Project_Obj_Rel_Insert_Input = {|
  data: Project_Insert_Input,
  /** on conflict condition */
  on_conflict?: ?Project_On_Conflict,
|};

/** on conflict condition type for table "project" */
export type Project_On_Conflict = {|
  constraint: Project_Constraint,
  update_columns: Array<Project_Update_Column>,
  where?: ?Project_Bool_Exp,
|};

/** Ordering options when selecting data from "project". */
export type Project_Order_By = {|
  archived?: ?Order_By,
  created_at?: ?Order_By,
  created_by?: ?Order_By,
  description?: ?Order_By,
  end_time?: ?Order_By,
  id?: ?Order_By,
  last_updated_at?: ?Order_By,
  last_updated_by?: ?Order_By,
  localities_aggregate?: ?Locality_Aggregate_Order_By,
  members_aggregate?: ?Member_Aggregate_Order_By,
  name?: ?Order_By,
  start_time?: ?Order_By,
  token?: ?Order_By,
|};

/** primary key columns input for table: project */
export type Project_Pk_Columns_Input = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export const Project_Select_ColumnValues = Object.freeze({
  /** column name */
  Archived: 'archived',
  /** column name */
  CreatedAt: 'created_at',
  /** column name */
  CreatedBy: 'created_by',
  /** column name */
  Description: 'description',
  /** column name */
  EndTime: 'end_time',
  /** column name */
  Id: 'id',
  /** column name */
  LastUpdatedAt: 'last_updated_at',
  /** column name */
  LastUpdatedBy: 'last_updated_by',
  /** column name */
  Name: 'name',
  /** column name */
  StartTime: 'start_time',
  /** column name */
  Token: 'token',
});

/** select columns of table "project" */
export type Project_Select_Column = $Values<typeof Project_Select_ColumnValues>;

/** input type for updating data in table "project" */
export type Project_Set_Input = {|
  archived?: ?$ElementType<Scalars, 'Boolean'>,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  end_time?: ?$ElementType<Scalars, 'timestamptz'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by?: ?$ElementType<Scalars, 'String'>,
  name?: ?$ElementType<Scalars, 'String'>,
  start_time?: ?$ElementType<Scalars, 'timestamptz'>,
  token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** aggregate stddev on columns */
export type Project_Stddev_Fields = {|
  __typename?: 'project_stddev_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** aggregate stddev_pop on columns */
export type Project_Stddev_Pop_Fields = {|
  __typename?: 'project_stddev_pop_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** aggregate stddev_samp on columns */
export type Project_Stddev_Samp_Fields = {|
  __typename?: 'project_stddev_samp_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** aggregate sum on columns */
export type Project_Sum_Fields = {|
  __typename?: 'project_sum_fields',
  id?: ?$ElementType<Scalars, 'bigint'>,
|};

export const Project_Update_ColumnValues = Object.freeze({
  /** column name */
  Archived: 'archived',
  /** column name */
  CreatedAt: 'created_at',
  /** column name */
  CreatedBy: 'created_by',
  /** column name */
  Description: 'description',
  /** column name */
  EndTime: 'end_time',
  /** column name */
  Id: 'id',
  /** column name */
  LastUpdatedAt: 'last_updated_at',
  /** column name */
  LastUpdatedBy: 'last_updated_by',
  /** column name */
  Name: 'name',
  /** column name */
  StartTime: 'start_time',
  /** column name */
  Token: 'token',
});

/** update columns of table "project" */
export type Project_Update_Column = $Values<typeof Project_Update_ColumnValues>;

/** aggregate var_pop on columns */
export type Project_Var_Pop_Fields = {|
  __typename?: 'project_var_pop_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** aggregate var_samp on columns */
export type Project_Var_Samp_Fields = {|
  __typename?: 'project_var_samp_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

/** aggregate variance on columns */
export type Project_Variance_Fields = {|
  __typename?: 'project_variance_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
|};

export type Query_Root = {|
  __typename?: 'query_root',
  /** fetch data from the table: "auth0_user" */
  auth0_user: Array<Auth0_User>,
  /** fetch aggregated fields from the table: "auth0_user" */
  auth0_user_aggregate: Auth0_User_Aggregate,
  /** fetch data from the table: "auth0_user" using primary key columns */
  auth0_user_by_pk?: ?Auth0_User,
  /** fetch data from the table: "locality" */
  locality: Array<Locality>,
  /** fetch aggregated fields from the table: "locality" */
  locality_aggregate: Locality_Aggregate,
  /** fetch data from the table: "locality" using primary key columns */
  locality_by_pk?: ?Locality,
  /** fetch data from the table: "member" */
  member: Array<Member>,
  /** fetch aggregated fields from the table: "member" */
  member_aggregate: Member_Aggregate,
  /** fetch data from the table: "member" using primary key columns */
  member_by_pk?: ?Member,
  /** fetch data from the table: "member_permissions_view" */
  member_permissions_view: Array<Member_Permissions_View>,
  /** fetch aggregated fields from the table: "member_permissions_view" */
  member_permissions_view_aggregate: Member_Permissions_View_Aggregate,
  /** fetch data from the table: "permission" */
  permission: Array<Permission>,
  /** fetch aggregated fields from the table: "permission" */
  permission_aggregate: Permission_Aggregate,
  /** fetch data from the table: "permission" using primary key columns */
  permission_by_pk?: ?Permission,
  /** fetch data from the table: "project" */
  project: Array<Project>,
  /** fetch aggregated fields from the table: "project" */
  project_aggregate: Project_Aggregate,
  /** fetch data from the table: "project" using primary key columns */
  project_by_pk?: ?Project,
|};

export type Query_RootAuth0_UserArgs = {|
  distinct_on?: ?Array<Auth0_User_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Auth0_User_Order_By>,
  where?: ?Auth0_User_Bool_Exp,
|};

export type Query_RootAuth0_User_AggregateArgs = {|
  distinct_on?: ?Array<Auth0_User_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Auth0_User_Order_By>,
  where?: ?Auth0_User_Bool_Exp,
|};

export type Query_RootAuth0_User_By_PkArgs = {|
  user_id: $ElementType<Scalars, 'String'>,
|};

export type Query_RootLocalityArgs = {|
  distinct_on?: ?Array<Locality_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Locality_Order_By>,
  where?: ?Locality_Bool_Exp,
|};

export type Query_RootLocality_AggregateArgs = {|
  distinct_on?: ?Array<Locality_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Locality_Order_By>,
  where?: ?Locality_Bool_Exp,
|};

export type Query_RootLocality_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export type Query_RootMemberArgs = {|
  distinct_on?: ?Array<Member_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Order_By>,
  where?: ?Member_Bool_Exp,
|};

export type Query_RootMember_AggregateArgs = {|
  distinct_on?: ?Array<Member_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Order_By>,
  where?: ?Member_Bool_Exp,
|};

export type Query_RootMember_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export type Query_RootMember_Permissions_ViewArgs = {|
  distinct_on?: ?Array<Member_Permissions_View_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Permissions_View_Order_By>,
  where?: ?Member_Permissions_View_Bool_Exp,
|};

export type Query_RootMember_Permissions_View_AggregateArgs = {|
  distinct_on?: ?Array<Member_Permissions_View_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Permissions_View_Order_By>,
  where?: ?Member_Permissions_View_Bool_Exp,
|};

export type Query_RootPermissionArgs = {|
  distinct_on?: ?Array<Permission_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Permission_Order_By>,
  where?: ?Permission_Bool_Exp,
|};

export type Query_RootPermission_AggregateArgs = {|
  distinct_on?: ?Array<Permission_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Permission_Order_By>,
  where?: ?Permission_Bool_Exp,
|};

export type Query_RootPermission_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export type Query_RootProjectArgs = {|
  distinct_on?: ?Array<Project_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Project_Order_By>,
  where?: ?Project_Bool_Exp,
|};

export type Query_RootProject_AggregateArgs = {|
  distinct_on?: ?Array<Project_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Project_Order_By>,
  where?: ?Project_Bool_Exp,
|};

export type Query_RootProject_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export type Subscription_Root = {|
  __typename?: 'subscription_root',
  /** fetch data from the table: "auth0_user" */
  auth0_user: Array<Auth0_User>,
  /** fetch aggregated fields from the table: "auth0_user" */
  auth0_user_aggregate: Auth0_User_Aggregate,
  /** fetch data from the table: "auth0_user" using primary key columns */
  auth0_user_by_pk?: ?Auth0_User,
  /** fetch data from the table: "locality" */
  locality: Array<Locality>,
  /** fetch aggregated fields from the table: "locality" */
  locality_aggregate: Locality_Aggregate,
  /** fetch data from the table: "locality" using primary key columns */
  locality_by_pk?: ?Locality,
  /** fetch data from the table: "member" */
  member: Array<Member>,
  /** fetch aggregated fields from the table: "member" */
  member_aggregate: Member_Aggregate,
  /** fetch data from the table: "member" using primary key columns */
  member_by_pk?: ?Member,
  /** fetch data from the table: "member_permissions_view" */
  member_permissions_view: Array<Member_Permissions_View>,
  /** fetch aggregated fields from the table: "member_permissions_view" */
  member_permissions_view_aggregate: Member_Permissions_View_Aggregate,
  /** fetch data from the table: "permission" */
  permission: Array<Permission>,
  /** fetch aggregated fields from the table: "permission" */
  permission_aggregate: Permission_Aggregate,
  /** fetch data from the table: "permission" using primary key columns */
  permission_by_pk?: ?Permission,
  /** fetch data from the table: "project" */
  project: Array<Project>,
  /** fetch aggregated fields from the table: "project" */
  project_aggregate: Project_Aggregate,
  /** fetch data from the table: "project" using primary key columns */
  project_by_pk?: ?Project,
|};

export type Subscription_RootAuth0_UserArgs = {|
  distinct_on?: ?Array<Auth0_User_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Auth0_User_Order_By>,
  where?: ?Auth0_User_Bool_Exp,
|};

export type Subscription_RootAuth0_User_AggregateArgs = {|
  distinct_on?: ?Array<Auth0_User_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Auth0_User_Order_By>,
  where?: ?Auth0_User_Bool_Exp,
|};

export type Subscription_RootAuth0_User_By_PkArgs = {|
  user_id: $ElementType<Scalars, 'String'>,
|};

export type Subscription_RootLocalityArgs = {|
  distinct_on?: ?Array<Locality_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Locality_Order_By>,
  where?: ?Locality_Bool_Exp,
|};

export type Subscription_RootLocality_AggregateArgs = {|
  distinct_on?: ?Array<Locality_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Locality_Order_By>,
  where?: ?Locality_Bool_Exp,
|};

export type Subscription_RootLocality_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export type Subscription_RootMemberArgs = {|
  distinct_on?: ?Array<Member_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Order_By>,
  where?: ?Member_Bool_Exp,
|};

export type Subscription_RootMember_AggregateArgs = {|
  distinct_on?: ?Array<Member_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Order_By>,
  where?: ?Member_Bool_Exp,
|};

export type Subscription_RootMember_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export type Subscription_RootMember_Permissions_ViewArgs = {|
  distinct_on?: ?Array<Member_Permissions_View_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Permissions_View_Order_By>,
  where?: ?Member_Permissions_View_Bool_Exp,
|};

export type Subscription_RootMember_Permissions_View_AggregateArgs = {|
  distinct_on?: ?Array<Member_Permissions_View_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Member_Permissions_View_Order_By>,
  where?: ?Member_Permissions_View_Bool_Exp,
|};

export type Subscription_RootPermissionArgs = {|
  distinct_on?: ?Array<Permission_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Permission_Order_By>,
  where?: ?Permission_Bool_Exp,
|};

export type Subscription_RootPermission_AggregateArgs = {|
  distinct_on?: ?Array<Permission_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Permission_Order_By>,
  where?: ?Permission_Bool_Exp,
|};

export type Subscription_RootPermission_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export type Subscription_RootProjectArgs = {|
  distinct_on?: ?Array<Project_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Project_Order_By>,
  where?: ?Project_Bool_Exp,
|};

export type Subscription_RootProject_AggregateArgs = {|
  distinct_on?: ?Array<Project_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Project_Order_By>,
  where?: ?Project_Bool_Exp,
|};

export type Subscription_RootProject_By_PkArgs = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {|
  _eq?: ?$ElementType<Scalars, 'timestamptz'>,
  _gt?: ?$ElementType<Scalars, 'timestamptz'>,
  _gte?: ?$ElementType<Scalars, 'timestamptz'>,
  _in?: ?Array<$ElementType<Scalars, 'timestamptz'>>,
  _is_null?: ?$ElementType<Scalars, 'Boolean'>,
  _lt?: ?$ElementType<Scalars, 'timestamptz'>,
  _lte?: ?$ElementType<Scalars, 'timestamptz'>,
  _neq?: ?$ElementType<Scalars, 'timestamptz'>,
  _nin?: ?Array<$ElementType<Scalars, 'timestamptz'>>,
|};
