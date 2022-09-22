import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import { UserProfile } from '@auth0/nextjs-auth0';

import { Alert, Button, Col, Container, Row } from 'react-bootstrap';

import { ProjectApi } from 'lib/apis';
import auth0 from 'lib/auth0';
import Layout from 'lib/components/layout';
import { ReadProjects200Response } from 'lib/models';
import PageableList from 'lib/components/pageable-list';
import ProjectList from 'lib/components/projects/list';

import styles from './projects.module.scss';
import { useState } from 'react';
import NewProjectModal from 'lib/components/projects/new-project-modal';

type ProjectsProps = { user: UserProfile } & ReadProjects200Response;

const Projects: NextPage<ProjectsProps> = ({ user, contents, number, totalPages }) => {
  const [show, setShow] = useState(false);

  const handleVisibilityChange = () => setShow(!show);

  return (
    <Layout user={user}>
      <Container>
        <Row className="align-items-center">
          <Col md={10}>
            <h1 className={styles.pageTitle}>Projekt</h1>
          </Col>
          <Col md={2}>
            <Button variant="primary" className="w-100" onClick={handleVisibilityChange}>
              Neus Projekt
            </Button>
          </Col>
        </Row>
      </Container>

      {contents?.length === 0 ? (
        <Alert key="no-projects-present" variant="warning">
          Du bisch no kenä Projekt biträtte...
        </Alert>
      ) : (
        <PageableList number={number || 1} totalPages={totalPages || 1}>
          <ProjectList projects={contents || []} />
        </PageableList>
      )}

      <NewProjectModal show={show} handleVisibilityChange={handleVisibilityChange} />
    </Layout>
  );
};

const getProjects = async (accessToken: String): Promise<ReadProjects200Response> =>
  new ProjectApi().readProjects({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getServerSideProps: GetServerSideProps = auth0.withPageAuthRequired({
  returnTo: '/projects',
  async getServerSideProps({ req, res }) {
    let response: ReadProjects200Response = {
      contents: [],
    };

    try {
      const { accessToken } = await auth0.getAccessToken(req, res, {
        authorizationParams: {
          audience: 'http://localhost:8081',
        },
        scopes: ['restapi:access'],
      });
      response = await getProjects(accessToken!);
    } catch (e) {
      // TODO: Error handling
      console.log('error: ', e);
    }

    return { props: { ...response } };
  },
});

export default Projects;
