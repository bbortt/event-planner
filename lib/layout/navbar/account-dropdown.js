// @flow
import * as React from 'react';

import Image from 'next/image';

import { useAuth0 } from '@auth0/auth0-react';
import { User } from '@auth0/auth0-spa-js';

import styles from './account-dropdown.module.scss';

export const AccountDropdown = (): React.Element<'ul'> => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0<typeof User>();

  return (
    <ul className="dropdown menu" data-dropdown-menu>
      {isAuthenticated ? (
        <li>
          <a>
            {user.picture ? (
              <div className={styles.profilePictureInline}>
                <Image src={user.picture} layout="fill" alt={user.nickname} />
              </div>
            ) : (
              user.nickname
            )}
          </a>
          <ul className="menu vertical">
            <li>
              <a onClick={logout}>Usloggä</a>
            </li>
          </ul>
        </li>
      ) : (
        <li>
          <button type="button" className="button" onClick={loginWithRedirect} aria-label="Login">
            Iloggä
          </button>
        </li>
      )}
    </ul>
  );
};

export default AccountDropdown;
