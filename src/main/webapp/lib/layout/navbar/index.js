// @flow
import * as React from 'react';
import { useState } from 'react';

import { useAuth0 } from '@auth0/auth0-react';

import renderFoundationNode from '../../foundation/render-foundation-node';

import AccountDropdown from './account-dropdown';

export const Navbar = (): React.Element<'div'> => {
  const { error, isAuthenticated, isLoading } = useAuth0();
  const [navbarVisible, setNavbarVisible] = useState(false);

  const initializeNavbar = (node: React.ElementRef<React.ElementType>) => {
    if (!navbarVisible) {
      renderFoundationNode(node, () => setNavbarVisible(true));
    }
  };

  if (isLoading || error) {
    return <div></div>;
  }

  return (
    <div ref={initializeNavbar} hidden={!navbarVisible}>
      <div className="title-bar" data-responsive-toggle="animated-menu" data-hide-for="medium">
        <button type="button" className="menu-icon" data-toggle></button>
        <div className="title-bar-title">Menu</div>
      </div>

      <div className="top-bar" id="animated-menu" data-animate="hinge-in-from-top spin-out">
        <div className="top-bar-left">
          <ul className="dropdown menu" data-dropdown-menu>
            <li className="menu-text">EVENT PLANER</li>
            {isAuthenticated && (
              <li>
                <a href="/projects">Miner Projekt</a>
              </li>
            )}
          </ul>
        </div>

        <div className="top-bar-right">
          <AccountDropdown />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
