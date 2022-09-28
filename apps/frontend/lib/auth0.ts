import { NextApiRequest, NextApiResponse } from 'next';

import { IncomingMessage, ServerResponse } from 'http';

import { initAuth0 } from '@auth0/nextjs-auth0';
import { SignInWithAuth0 } from '@auth0/nextjs-auth0/dist/instance';

import { Configuration } from 'lib/runtime';

const audience = process.env.NODE_ENV == 'production' ? process.env.NEXT_PUBLIC_AUTH0_AUDIENCE : 'http://localhost:8081';

const auth0: SignInWithAuth0 = initAuth0({
  secret: process.env.SESSION_COOKIE_SECRET,
  issuerBaseURL: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  routes: {
    callback: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
    postLogoutRedirect: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000',
  },
  authorizationParams: {
    audience,
    response_type: 'code',
    scope: 'openid profile restapi:access',
  },
  session: {
    absoluteDuration: Number(process.env.SESSION_COOKIE_LIFETIME),
  },
});

export default auth0;

export const getAccessToken = async (
  req: IncomingMessage | NextApiRequest,
  res: NextApiResponse | ServerResponse,
  audience: string,
  scopes: string[]
): Promise<string> => {
  const { accessToken } = await auth0.getAccessToken(req, res, {
    authorizationParams: {
      audience,
    },
    scopes,
  });
  if (!accessToken) {
    throw Error('Unable to fetch access token!');
  }
  return accessToken;
};

const clientSideConfig: () => Configuration = () =>
  new Configuration({
    basePath: `${window.location.origin}/api/rest`,
  });

export const wrapWithContext = <T>(constructor: (configuration?: Configuration) => T): T => {
  if (typeof window !== 'undefined') {
    return constructor(clientSideConfig());
  } else {
    return constructor();
  }
};
