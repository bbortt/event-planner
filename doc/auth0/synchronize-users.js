/**
 * Handler that will synchronize the current user into the application database.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const axios = require('axios');
  const domain = process.env.DOMAIN; // <- insert your domain here
  const client_id = event.secrets.HOOK_CLIENT_ID;
  const client_secret = event.secrets.HOOK_CLIENT_SECRET;

  const url = `https://${domain}/oauth/token`;
  const audience = process.env.AUDIENCE; // <- insert your audience here

  const { user_id, nickname, email, picture, family_name, given_name } = event.user;

  try {
    const tokenResponse = await axios.post(url, {
      client_id,
      client_secret,
      audience,
      grant_type: 'client_credentials',
    });

    const token = tokenResponse.data.access_token;
    await axios.put(
      `${audience}/api/rest/v1/user/${user_id}`,
      {
        nickname,
        email,
        picture,
        family_name,
        given_name,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("successfully synchronized user '{}'", user_id);
  } catch (err) {
    // Handle error.
    console.error(err);
  }
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
// exports.onContinuePostLogin = async (event, api) => {
// };
