import { UserProfile } from '@auth0/nextjs-auth0';

declare global {
  interface Window {
    __user?: UserProfile;
  }
}

export type User = {
  email: string;
  email_verified: boolean;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
};
