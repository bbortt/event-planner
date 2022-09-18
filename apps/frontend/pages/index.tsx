import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import { UserProfile } from '@auth0/nextjs-auth0';

import auth0 from 'lib/auth0';
import Layout from 'lib/components/layout';
import Masthead from 'lib/components/masthead';

type HomeProps = {
  user?: UserProfile;
};

const Home: NextPage = ({ user }: HomeProps) => {
  return (
    <Layout user={user}>
      <Masthead />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await auth0.getSession(req, res);

  if (session && session.user) {
    return { redirect: { destination: '/projects', permanent: false } };
  }

  return { props: { user: session ? session.user : null } };
};

export default Home;
