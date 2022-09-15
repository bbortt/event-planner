/**
 * Handler that will assign the default role 'User' after sign up.
 *
 * @param {Event} event - Details about the context and user that has registered.
 */
exports.onExecutePostUserRegistration = async (event) => {
  const ManagementClient = require("auth0").ManagementClient;
  const axios = require("axios");
  const domain = process.env.DOMAIN; // <- insert your domain here
  const client_id = event.secrets.HOOK_CLIENT_ID;
  const client_secret = event.secrets.HOOK_CLIENT_SECRET;

  const url = `https://${domain}/oauth/token`;
  const audience = `https://${domain}/api/v2/`;
  const role = "User";

  const { user } = event;

  try {
    const response = await axios.post(url, {
      client_id,
      client_secret,
      audience,
      grant_type: "client_credentials",
    });

    const token = response.data.access_token;
    const management = new ManagementClient({ token, domain, audience });

    const params = { id: `auth0|${user.user_id}` };
    const data = { roles: [role] };

    management.users.assignRoles(params, data, function (err) {
      if (err) {
        // Handle error.
        console.error(err);
      }
      console.log("successfully assigned default role 'User'");
    });
  } catch (err) {
    // Handle error.
    console.error(err);
  }
};
