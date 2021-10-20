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
  invitations: Array<Invitation>,
  /** An aggregate relationship */
  invitations_aggregate: Invitation_Aggregate,
  nickname: $ElementType<Scalars, 'String'>,
  picture?: ?$ElementType<Scalars, 'String'>,
  user_id: $ElementType<Scalars, 'String'>,
|};


/** columns and relationships of "auth0_user" */
export type Auth0_UserInvitationsArgs = {|
  distinct_on?: ?Array<Invitation_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Invitation_Order_By>,
  where?: ?Invitation_Bool_Exp,
|};


/** columns and relationships of "auth0_user" */
export type Auth0_UserInvitations_AggregateArgs = {|
  distinct_on?: ?Array<Invitation_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Invitation_Order_By>,
  where?: ?Invitation_Bool_Exp,
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
  invitations?: ?Invitation_Bool_Exp,
  nickname?: ?String_Comparison_Exp,
  picture?: ?String_Comparison_Exp,
  user_id?: ?String_Comparison_Exp,
|};

export const Auth0_User_ConstraintValues = Object.freeze({
  /** unique or primary key constraint */
  Auth0UserPkey: 'auth0_user_pkey',
  /** unique or primary key constraint */
  UniqueEmail: 'unique_email'
});


/** unique or primary key constraints on table "auth0_user" */
export type Auth0_User_Constraint = $Values<typeof Auth0_User_ConstraintValues>;

/** input type for inserting data into table "auth0_user" */
export type Auth0_User_Insert_Input = {|
  email?: ?$ElementType<Scalars, 'String'>,
  family_name?: ?$ElementType<Scalars, 'String'>,
  given_name?: ?$ElementType<Scalars, 'String'>,
  invitations?: ?Invitation_Arr_Rel_Insert_Input,
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
  invitations_aggregate?: ?Invitation_Aggregate_Order_By,
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
  UserId: 'user_id'
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
  UserId: 'user_id'
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

/** columns and relationships of "invitation" */
export type Invitation = {|
  __typename?: 'invitation',
  accepted: $ElementType<Scalars, 'Boolean'>,
  accepted_at?: ?$ElementType<Scalars, 'timestamptz'>,
  /** An object relationship */
  accepted_by?: ?Auth0_User,
  auth0_user_id?: ?$ElementType<Scalars, 'String'>,
  created_at: $ElementType<Scalars, 'timestamptz'>,
  created_by: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'bigint'>,
  /** An object relationship */
  invited_to: Project,
  nickname: $ElementType<Scalars, 'String'>,
  project_id: $ElementType<Scalars, 'bigint'>,
  token: $ElementType<Scalars, 'bpchar'>,
|};

/** aggregated selection of "invitation" */
export type Invitation_Aggregate = {|
  __typename?: 'invitation_aggregate',
  aggregate?: ?Invitation_Aggregate_Fields,
  nodes: Array<Invitation>,
|};

/** aggregate fields of "invitation" */
export type Invitation_Aggregate_Fields = {|
  __typename?: 'invitation_aggregate_fields',
  avg?: ?Invitation_Avg_Fields,
  count: $ElementType<Scalars, 'Int'>,
  max?: ?Invitation_Max_Fields,
  min?: ?Invitation_Min_Fields,
  stddev?: ?Invitation_Stddev_Fields,
  stddev_pop?: ?Invitation_Stddev_Pop_Fields,
  stddev_samp?: ?Invitation_Stddev_Samp_Fields,
  sum?: ?Invitation_Sum_Fields,
  var_pop?: ?Invitation_Var_Pop_Fields,
  var_samp?: ?Invitation_Var_Samp_Fields,
  variance?: ?Invitation_Variance_Fields,
|};


/** aggregate fields of "invitation" */
export type Invitation_Aggregate_FieldsCountArgs = {|
  columns?: ?Array<Invitation_Select_Column>,
  distinct?: ?$ElementType<Scalars, 'Boolean'>,
|};

/** order by aggregate values of table "invitation" */
export type Invitation_Aggregate_Order_By = {|
  avg?: ?Invitation_Avg_Order_By,
  count?: ?Order_By,
  max?: ?Invitation_Max_Order_By,
  min?: ?Invitation_Min_Order_By,
  stddev?: ?Invitation_Stddev_Order_By,
  stddev_pop?: ?Invitation_Stddev_Pop_Order_By,
  stddev_samp?: ?Invitation_Stddev_Samp_Order_By,
  sum?: ?Invitation_Sum_Order_By,
  var_pop?: ?Invitation_Var_Pop_Order_By,
  var_samp?: ?Invitation_Var_Samp_Order_By,
  variance?: ?Invitation_Variance_Order_By,
|};

/** input type for inserting array relation for remote table "invitation" */
export type Invitation_Arr_Rel_Insert_Input = {|
  data: Array<Invitation_Insert_Input>,
  /** on conflict condition */
  on_conflict?: ?Invitation_On_Conflict,
|};

/** aggregate avg on columns */
export type Invitation_Avg_Fields = {|
  __typename?: 'invitation_avg_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by avg() on columns of table "invitation" */
export type Invitation_Avg_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** Boolean expression to filter rows from the table "invitation". All fields are combined with a logical 'AND'. */
export type Invitation_Bool_Exp = {|
  _and?: ?Array<Invitation_Bool_Exp>,
  _not?: ?Invitation_Bool_Exp,
  _or?: ?Array<Invitation_Bool_Exp>,
  accepted?: ?Boolean_Comparison_Exp,
  accepted_at?: ?Timestamptz_Comparison_Exp,
  accepted_by?: ?Auth0_User_Bool_Exp,
  auth0_user_id?: ?String_Comparison_Exp,
  created_at?: ?Timestamptz_Comparison_Exp,
  created_by?: ?String_Comparison_Exp,
  id?: ?Bigint_Comparison_Exp,
  invited_to?: ?Project_Bool_Exp,
  nickname?: ?String_Comparison_Exp,
  project_id?: ?Bigint_Comparison_Exp,
  token?: ?Bpchar_Comparison_Exp,
|};

export const Invitation_ConstraintValues = Object.freeze({
  /** unique or primary key constraint */
  InvitationPkey: 'invitation_pkey',
  /** unique or primary key constraint */
  UniqueInvitation: 'unique_invitation',
  /** unique or primary key constraint */
  UniqueToken: 'unique_token'
});


/** unique or primary key constraints on table "invitation" */
export type Invitation_Constraint = $Values<typeof Invitation_ConstraintValues>;

/** input type for incrementing numeric columns in table "invitation" */
export type Invitation_Inc_Input = {|
  id?: ?$ElementType<Scalars, 'bigint'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** input type for inserting data into table "invitation" */
export type Invitation_Insert_Input = {|
  accepted?: ?$ElementType<Scalars, 'Boolean'>,
  accepted_at?: ?$ElementType<Scalars, 'timestamptz'>,
  accepted_by?: ?Auth0_User_Obj_Rel_Insert_Input,
  auth0_user_id?: ?$ElementType<Scalars, 'String'>,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  invited_to?: ?Project_Obj_Rel_Insert_Input,
  nickname?: ?$ElementType<Scalars, 'String'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
  token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** aggregate max on columns */
export type Invitation_Max_Fields = {|
  __typename?: 'invitation_max_fields',
  accepted_at?: ?$ElementType<Scalars, 'timestamptz'>,
  auth0_user_id?: ?$ElementType<Scalars, 'String'>,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  nickname?: ?$ElementType<Scalars, 'String'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
  token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** order by max() on columns of table "invitation" */
export type Invitation_Max_Order_By = {|
  accepted_at?: ?Order_By,
  auth0_user_id?: ?Order_By,
  created_at?: ?Order_By,
  created_by?: ?Order_By,
  id?: ?Order_By,
  nickname?: ?Order_By,
  project_id?: ?Order_By,
  token?: ?Order_By,
|};

/** aggregate min on columns */
export type Invitation_Min_Fields = {|
  __typename?: 'invitation_min_fields',
  accepted_at?: ?$ElementType<Scalars, 'timestamptz'>,
  auth0_user_id?: ?$ElementType<Scalars, 'String'>,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  nickname?: ?$ElementType<Scalars, 'String'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
  token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** order by min() on columns of table "invitation" */
export type Invitation_Min_Order_By = {|
  accepted_at?: ?Order_By,
  auth0_user_id?: ?Order_By,
  created_at?: ?Order_By,
  created_by?: ?Order_By,
  id?: ?Order_By,
  nickname?: ?Order_By,
  project_id?: ?Order_By,
  token?: ?Order_By,
|};

/** response of any mutation on the table "invitation" */
export type Invitation_Mutation_Response = {|
  __typename?: 'invitation_mutation_response',
  /** number of rows affected by the mutation */
  affected_rows: $ElementType<Scalars, 'Int'>,
  /** data from the rows affected by the mutation */
  returning: Array<Invitation>,
|};

/** on conflict condition type for table "invitation" */
export type Invitation_On_Conflict = {|
  constraint: Invitation_Constraint,
  update_columns: Array<Invitation_Update_Column>,
  where?: ?Invitation_Bool_Exp,
|};

/** Ordering options when selecting data from "invitation". */
export type Invitation_Order_By = {|
  accepted?: ?Order_By,
  accepted_at?: ?Order_By,
  accepted_by?: ?Auth0_User_Order_By,
  auth0_user_id?: ?Order_By,
  created_at?: ?Order_By,
  created_by?: ?Order_By,
  id?: ?Order_By,
  invited_to?: ?Project_Order_By,
  nickname?: ?Order_By,
  project_id?: ?Order_By,
  token?: ?Order_By,
|};

/** primary key columns input for table: invitation */
export type Invitation_Pk_Columns_Input = {|
  id: $ElementType<Scalars, 'bigint'>,
|};

export const Invitation_Select_ColumnValues = Object.freeze({
  /** column name */
  Accepted: 'accepted',
  /** column name */
  AcceptedAt: 'accepted_at',
  /** column name */
  Auth0UserId: 'auth0_user_id',
  /** column name */
  CreatedAt: 'created_at',
  /** column name */
  CreatedBy: 'created_by',
  /** column name */
  Id: 'id',
  /** column name */
  Nickname: 'nickname',
  /** column name */
  ProjectId: 'project_id',
  /** column name */
  Token: 'token'
});


/** select columns of table "invitation" */
export type Invitation_Select_Column = $Values<typeof Invitation_Select_ColumnValues>;

/** input type for updating data in table "invitation" */
export type Invitation_Set_Input = {|
  accepted?: ?$ElementType<Scalars, 'Boolean'>,
  accepted_at?: ?$ElementType<Scalars, 'timestamptz'>,
  auth0_user_id?: ?$ElementType<Scalars, 'String'>,
  created_at?: ?$ElementType<Scalars, 'timestamptz'>,
  created_by?: ?$ElementType<Scalars, 'String'>,
  id?: ?$ElementType<Scalars, 'bigint'>,
  nickname?: ?$ElementType<Scalars, 'String'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
  token?: ?$ElementType<Scalars, 'bpchar'>,
|};

/** aggregate stddev on columns */
export type Invitation_Stddev_Fields = {|
  __typename?: 'invitation_stddev_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev() on columns of table "invitation" */
export type Invitation_Stddev_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate stddev_pop on columns */
export type Invitation_Stddev_Pop_Fields = {|
  __typename?: 'invitation_stddev_pop_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev_pop() on columns of table "invitation" */
export type Invitation_Stddev_Pop_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate stddev_samp on columns */
export type Invitation_Stddev_Samp_Fields = {|
  __typename?: 'invitation_stddev_samp_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by stddev_samp() on columns of table "invitation" */
export type Invitation_Stddev_Samp_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate sum on columns */
export type Invitation_Sum_Fields = {|
  __typename?: 'invitation_sum_fields',
  id?: ?$ElementType<Scalars, 'bigint'>,
  project_id?: ?$ElementType<Scalars, 'bigint'>,
|};

/** order by sum() on columns of table "invitation" */
export type Invitation_Sum_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

export const Invitation_Update_ColumnValues = Object.freeze({
  /** column name */
  Accepted: 'accepted',
  /** column name */
  AcceptedAt: 'accepted_at',
  /** column name */
  Auth0UserId: 'auth0_user_id',
  /** column name */
  CreatedAt: 'created_at',
  /** column name */
  CreatedBy: 'created_by',
  /** column name */
  Id: 'id',
  /** column name */
  Nickname: 'nickname',
  /** column name */
  ProjectId: 'project_id',
  /** column name */
  Token: 'token'
});


/** update columns of table "invitation" */
export type Invitation_Update_Column = $Values<typeof Invitation_Update_ColumnValues>;

/** aggregate var_pop on columns */
export type Invitation_Var_Pop_Fields = {|
  __typename?: 'invitation_var_pop_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by var_pop() on columns of table "invitation" */
export type Invitation_Var_Pop_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate var_samp on columns */
export type Invitation_Var_Samp_Fields = {|
  __typename?: 'invitation_var_samp_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by var_samp() on columns of table "invitation" */
export type Invitation_Var_Samp_Order_By = {|
  id?: ?Order_By,
  project_id?: ?Order_By,
|};

/** aggregate variance on columns */
export type Invitation_Variance_Fields = {|
  __typename?: 'invitation_variance_fields',
  id?: ?$ElementType<Scalars, 'Float'>,
  project_id?: ?$ElementType<Scalars, 'Float'>,
|};

/** order by variance() on columns of table "invitation" */
export type Invitation_Variance_Order_By = {|
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
  /** delete data from the table: "invitation" */
  delete_invitation?: ?Invitation_Mutation_Response,
  /** delete single row from the table: "invitation" */
  delete_invitation_by_pk?: ?Invitation,
  /** delete data from the table: "project" */
  delete_project?: ?Project_Mutation_Response,
  /** delete single row from the table: "project" */
  delete_project_by_pk?: ?Project,
  /** insert data into the table: "auth0_user" */
  insert_auth0_user?: ?Auth0_User_Mutation_Response,
  /** insert a single row into the table: "auth0_user" */
  insert_auth0_user_one?: ?Auth0_User,
  /** insert data into the table: "invitation" */
  insert_invitation?: ?Invitation_Mutation_Response,
  /** insert a single row into the table: "invitation" */
  insert_invitation_one?: ?Invitation,
  /** insert data into the table: "project" */
  insert_project?: ?Project_Mutation_Response,
  /** insert a single row into the table: "project" */
  insert_project_one?: ?Project,
  /** update data of the table: "auth0_user" */
  update_auth0_user?: ?Auth0_User_Mutation_Response,
  /** update single row of the table: "auth0_user" */
  update_auth0_user_by_pk?: ?Auth0_User,
  /** update data of the table: "invitation" */
  update_invitation?: ?Invitation_Mutation_Response,
  /** update single row of the table: "invitation" */
  update_invitation_by_pk?: ?Invitation,
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
export type Mutation_RootDelete_InvitationArgs = {|
  where: Invitation_Bool_Exp,
|};


/** mutation root */
export type Mutation_RootDelete_Invitation_By_PkArgs = {|
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
export type Mutation_RootInsert_InvitationArgs = {|
  objects: Array<Invitation_Insert_Input>,
  on_conflict?: ?Invitation_On_Conflict,
|};


/** mutation root */
export type Mutation_RootInsert_Invitation_OneArgs = {|
  object: Invitation_Insert_Input,
  on_conflict?: ?Invitation_On_Conflict,
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
export type Mutation_RootUpdate_InvitationArgs = {|
  _inc?: ?Invitation_Inc_Input,
  _set?: ?Invitation_Set_Input,
  where: Invitation_Bool_Exp,
|};


/** mutation root */
export type Mutation_RootUpdate_Invitation_By_PkArgs = {|
  _inc?: ?Invitation_Inc_Input,
  _set?: ?Invitation_Set_Input,
  pk_columns: Invitation_Pk_Columns_Input,
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
  DescNullsLast: 'desc_nulls_last'
});


/** column ordering options */
export type Order_By = $Values<typeof Order_ByValues>;

/** columns and relationships of "project" */
export type Project = {|
  __typename?: 'project',
  archived: $ElementType<Scalars, 'Boolean'>,
  created_at: $ElementType<Scalars, 'timestamptz'>,
  created_by: $ElementType<Scalars, 'String'>,
  description?: ?$ElementType<Scalars, 'String'>,
  end_time?: ?$ElementType<Scalars, 'timestamptz'>,
  id: $ElementType<Scalars, 'bigint'>,
  /** An array relationship */
  invitations: Array<Invitation>,
  /** An aggregate relationship */
  invitations_aggregate: Invitation_Aggregate,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by: $ElementType<Scalars, 'String'>,
  name: $ElementType<Scalars, 'String'>,
  start_time?: ?$ElementType<Scalars, 'timestamptz'>,
|};


/** columns and relationships of "project" */
export type ProjectInvitationsArgs = {|
  distinct_on?: ?Array<Invitation_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Invitation_Order_By>,
  where?: ?Invitation_Bool_Exp,
|};


/** columns and relationships of "project" */
export type ProjectInvitations_AggregateArgs = {|
  distinct_on?: ?Array<Invitation_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Invitation_Order_By>,
  where?: ?Invitation_Bool_Exp,
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
  invitations?: ?Invitation_Bool_Exp,
  last_updated_at?: ?Timestamptz_Comparison_Exp,
  last_updated_by?: ?String_Comparison_Exp,
  name?: ?String_Comparison_Exp,
  start_time?: ?Timestamptz_Comparison_Exp,
|};

export const Project_ConstraintValues = Object.freeze({
  /** unique or primary key constraint */
  ProjectPkey: 'project_pkey'
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
  invitations?: ?Invitation_Arr_Rel_Insert_Input,
  last_updated_at?: ?$ElementType<Scalars, 'timestamptz'>,
  last_updated_by?: ?$ElementType<Scalars, 'String'>,
  name?: ?$ElementType<Scalars, 'String'>,
  start_time?: ?$ElementType<Scalars, 'timestamptz'>,
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
  invitations_aggregate?: ?Invitation_Aggregate_Order_By,
  last_updated_at?: ?Order_By,
  last_updated_by?: ?Order_By,
  name?: ?Order_By,
  start_time?: ?Order_By,
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
  StartTime: 'start_time'
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
  StartTime: 'start_time'
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
  /** fetch data from the table: "invitation" */
  invitation: Array<Invitation>,
  /** fetch aggregated fields from the table: "invitation" */
  invitation_aggregate: Invitation_Aggregate,
  /** fetch data from the table: "invitation" using primary key columns */
  invitation_by_pk?: ?Invitation,
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


export type Query_RootInvitationArgs = {|
  distinct_on?: ?Array<Invitation_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Invitation_Order_By>,
  where?: ?Invitation_Bool_Exp,
|};


export type Query_RootInvitation_AggregateArgs = {|
  distinct_on?: ?Array<Invitation_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Invitation_Order_By>,
  where?: ?Invitation_Bool_Exp,
|};


export type Query_RootInvitation_By_PkArgs = {|
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
  /** fetch data from the table: "invitation" */
  invitation: Array<Invitation>,
  /** fetch aggregated fields from the table: "invitation" */
  invitation_aggregate: Invitation_Aggregate,
  /** fetch data from the table: "invitation" using primary key columns */
  invitation_by_pk?: ?Invitation,
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


export type Subscription_RootInvitationArgs = {|
  distinct_on?: ?Array<Invitation_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Invitation_Order_By>,
  where?: ?Invitation_Bool_Exp,
|};


export type Subscription_RootInvitation_AggregateArgs = {|
  distinct_on?: ?Array<Invitation_Select_Column>,
  limit?: ?$ElementType<Scalars, 'Int'>,
  offset?: ?$ElementType<Scalars, 'Int'>,
  order_by?: ?Array<Invitation_Order_By>,
  where?: ?Invitation_Bool_Exp,
|};


export type Subscription_RootInvitation_By_PkArgs = {|
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
