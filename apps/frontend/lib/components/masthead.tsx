import { Button, Col, Container, Row } from 'react-bootstrap';

import styles from './masthead.module.scss';

const Masthead = () => {
  return (
    <header className={styles.masthead}>
      <Container className="md-container">
        <Row className="align-items-center justify-content-center text-center">
          <Col lg={8} className="align-self-end">
            <h1 className="font-weight-bold">Mit mir mänätschisch diner Events locker!</h1>
            <hr className="divider" />
          </Col>
          <Col lg={8} className="align-self-baseline">
            <p className="mb-5">Es isch im Fall gar ned eso schwierig: Efach mal iloggä und aluegä. Findsch di de scho ds recht!</p>
            <Button href="/api/auth/login">Iloggä</Button>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Masthead;
