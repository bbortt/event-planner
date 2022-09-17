import Head from 'next/head';

import { Container } from 'react-bootstrap';

import Navbar from 'lib/components/navbar';
import { User } from 'lib/interfaces';

import styles from './layout.module.scss';

type ContentsProps = {
  user?: User;
  children: React.ReactNode;
};

const Contents = ({ user, children }: ContentsProps) => {
  return (
    <>
      <Navbar user={user} />

      <main className={styles.main}>
        <Container className="md-container">{children}</Container>
      </main>
    </>
  );
};

type LayoutProps = {
  user?: User;
  loading: boolean;
  children: React.ReactNode;
};

const Layout = ({ user, loading, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Next.js with Auth0</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>

      {loading ? <div>A nice loading animation...</div> : <Contents user={user}>{children}</Contents>}
    </>
  );
};

export default Layout;
