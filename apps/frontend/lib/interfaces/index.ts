import { UserProfile } from '@auth0/nextjs-auth0';

declare global {
  interface Window {
    __user?: UserProfile;
  }
}
