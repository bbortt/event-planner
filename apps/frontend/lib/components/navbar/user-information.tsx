import { UserProfile } from '@auth0/nextjs-auth0';

import { Image, NavDropdown } from 'react-bootstrap';

import styles from './user-information.module.scss';

type UserInformationProps = {
  user: UserProfile;
};

const UserIcon = ({ user }: UserInformationProps) => {
  return (
    <>
      <span>{user.nickname || 'Profil'}</span>
      {user.picture && <Image rounded src={user.picture} alt="Profile picture" className={styles.userIcon} />}
    </>
  );
};

const UserInformation = ({ user }: UserInformationProps) => {
  return (
    <NavDropdown title={<UserIcon user={user} />} id="collasible-nav-dropdown">
      <NavDropdown.Item href="/api/auth/logout">Usloggä</NavDropdown.Item>
    </NavDropdown>
  );
};

export default UserInformation;
