import type { NextPage } from 'next';

import Layout from 'lib/components/layout';
import Masthead from 'lib/components/masthead';
import ProjectList from 'lib/components/projects/list';
import { useFetchUser } from 'lib/user';

const Home: NextPage = () => {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      {user ? <ProjectList /> : <Masthead />}
    </Layout>
  );
};

export default Home;
