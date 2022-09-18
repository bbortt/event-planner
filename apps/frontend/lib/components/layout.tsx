import Head from 'next/head';

import { UserProfile } from '@auth0/nextjs-auth0';

import { Container } from 'react-bootstrap';

import Navbar from 'lib/components/navbar';

import styles from './layout.module.scss';

type ContentsProps = {
  user?: UserProfile;
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
  user?: UserProfile;
  children: React.ReactNode;
};

const Layout = ({ user, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Next.js with Auth0</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>

      <Contents user={user}>{children}</Contents>
    </>
  );
};

export default Layout;
