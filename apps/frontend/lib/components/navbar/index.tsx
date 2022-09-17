import { UserProfile } from '@auth0/nextjs-auth0';

import { Container, Nav, Navbar } from 'react-bootstrap';

import UserInformation from 'lib/components/navbar/user-information';

type NavbarProps = {
  user?: UserProfile;
};

const Navigation = ({ user }: NavbarProps) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Event-Planner</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/*<Nav.Link href='#features'>Features</Nav.Link>*/}
            {/*<Nav.Link href='#pricing'>Pricing</Nav.Link>*/}
            {/*<NavDropdown title='Dropdown' id='collasible-nav-dropdown'>*/}
            {/*    <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>*/}
            {/*    <NavDropdown.Item href='#action/3.2'>*/}
            {/*        Another action*/}
            {/*    </NavDropdown.Item>*/}
            {/*    <NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>*/}
            {/*    <NavDropdown.Divider />*/}
            {/*    <NavDropdown.Item href='#action/3.4'>*/}
            {/*        Separated link*/}
            {/*    </NavDropdown.Item>*/}
            {/*</NavDropdown>*/}
          </Nav>
          <Nav>{user ? <UserInformation user={user} /> : <Nav.Link href="/api/auth/login">Iloggä</Nav.Link>}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
