import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import { UserProfile } from '@auth0/nextjs-auth0';

import { ProjectApi } from 'lib/apis';
import auth0 from 'lib/auth0';
import Layout from 'lib/components/layout';
import ProjectList from 'lib/components/projects/list';
import { Project } from 'lib/models';

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

    let session = auth0.getSession(req, res);
    console.log('session: ', session);

    try {
      console.log('process.env.NEXT_PUBLIC_AUTH0_SCOPE: ', process.env.NEXT_PUBLIC_AUTH0_SCOPE);
      const { accessToken } = await auth0.getAccessToken(req, res, {
        authorizationParams: {
          audience: 'http://localhost:8081',
        },
        scopes: ['restapi:access'],
      });
      console.log('accessToken: ', accessToken);
      projects = await getProjects(accessToken!);
    } catch (e) {
      console.log('error: ', e);
    }

    return { props: { projects } };
  },
});

export default Projects;
