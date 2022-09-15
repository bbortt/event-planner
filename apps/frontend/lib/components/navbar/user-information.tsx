import { Image, NavDropdown } from 'react-bootstrap';

import { User } from 'lib/interfaces';

import styles from './user-information.module.scss';

type UserInformationProps = {
  user: User;
};

const UserIcon = ({ user }: UserInformationProps) => {
  return (
    <>
      <span>{user.nickname}</span>
      <Image rounded src={user.picture} alt="" className={styles.userIcon} />
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
