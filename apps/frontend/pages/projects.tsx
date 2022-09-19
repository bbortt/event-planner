import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import { PageRoute, UserProfile } from '@auth0/nextjs-auth0';

import { ProjectApi } from 'lib/apis';
import auth0 from 'lib/auth0';
import Layout from 'lib/components/layout';
import ProjectList from 'lib/components/projects/list';
import { Project } from 'lib/models';
import type { WithPageAuthRequired } from '@auth0/nextjs-auth0/dist/helpers/with-page-auth-required';

type ProjectsProps = {
  user: UserProfile;
  projects: Project[];
};

const Projects: NextPage<ProjectsProps> = ({ user, projects }) => {
  return (
    <Layout user={user}>
      <ProjectList projects={projects} />
    </Layout>
  );
};

const getProjects = async (accessToken: String): Promise<Project[]> => {
  return (
    (
      await new ProjectApi().readProjects({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).contents || []
  );
};

export const getServerSideProps: GetServerSideProps = auth0.withPageAuthRequired({
  returnTo: '/projects',
  async getServerSideProps({ req, res }) {
    let projects: Project[] = [];

    try {
      const { accessToken } = await auth0.getAccessToken(req, res, { scopes: ['restapi:access'] });
      projects = await getProjects(accessToken!);
    } catch (e) {
      console.log('error: ', e);
    }

    return { props: { projects } };
  },
});

export default Projects;
