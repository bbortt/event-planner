# Developer Instructions

## Auth0

### Configure Hasura

In order to make Hasura work with Auth0,
follow [this tutorial](https://hasura.io/docs/latest/graphql/core/guides/integrations/auth0-jwt.html). You'll have to
use the `auth0-spa-js` rule, so the JWT token will have the custom claims attached. In your Auth0 dashboard, edit the
rule as following to have the actual roles assigned:

```js
function(user, context, callback) {
  const namespace = "https://hasura.io/jwt/claims";
  context.accessToken[namespace] =
    {
      'x-hasura-default-role': 'user',
      // do some custom logic to decide allowed roles
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-user-id': user.user_id
    };
  callback(null, user, context);
}
```

### Synchronizing users

We assume you provide each property for the table `auth0_user`:

```js
function(user, context, callback) {
  const userId = user.user_id;
  const nickname = user.nickname;

  const admin_secret = "xxxx";
  const url = "https://ready-panda-91.hasura.app/v1/graphql";
  const query = `mutation($userId: String!, $nickname: String) {
    insert_users(objects: [{
      id: $userId, name: $nickname, last_seen: "now()"
    }], on_conflict: {constraint: users_pkey, update_columns: [last_seen, name]}
    ) {
      affected_rows
    }
  }`;

  const variables = { "userId": userId, "nickname": nickname };

  request.post({
    url: url,
    headers: { 'content-type': 'application/json', 'x-hasura-admin-secret': admin_secret },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  }, function(error, response, body) {
    console.log(body);
    callback(null, user, context);
  });
}
```

**Attention:** If you cannot synchronize your users (e.g. when working on _localhost_) you must insert them
into `auth0_user` table manually.

### Default roles for new users

Follow [this comment](https://community.auth0.com/t/hook-at-post-registration-to-assign-a-role/57985/3) to assign
default roles to new users.

At the time being this would be: `[]`.
