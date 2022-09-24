import { useState } from 'react';

import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import { UserProfile } from '@auth0/nextjs-auth0';

import { Alert, Button, Col, Container, Row } from 'react-bootstrap';

import { ProjectApi } from 'lib/apis';
import auth0, { getAccessToken } from 'lib/auth0';
import Layout from 'lib/components/layout';
import NewProjectModal from 'lib/components/projects/new-project-modal';
import PageableList from 'lib/components/pageable-list';
import ProjectList from 'lib/components/projects/list';
import { Project, ReadProjects200Response } from 'lib/models';

import styles from './projects.module.scss';

type ProjectsProps = { user: UserProfile; error?: string } & ReadProjects200Response;

const Projects: NextPage<ProjectsProps> = ({ user, contents, number, totalPages, error }) => {
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(!!error);

  const handleVisibilityChange = (project?: Project) => {
    setShowModal(!showModal);

    if (project) {
      console.log('route to project: ', project);
    }
  };

  return (
    <Layout user={user}>
      <Container>
        <Row className="align-items-center">
          <Col md={10}>
            <h1 className={styles.pageTitle}>Projekt</h1>
          </Col>
          <Col md={2}>
            <Button variant="primary" className="w-100" onClick={() => handleVisibilityChange()}>
              Neus Projekt
            </Button>
          </Col>
        </Row>
      </Container>

      <Alert key="failed-to-fetch-data" variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
        {error}
      </Alert>

      {contents?.length === 0 ? (
        <Alert key="no-projects-present" variant="warning">
          Du bisch no kenä Projekt biträtte...
        </Alert>
      ) : (
        <PageableList number={number || 1} totalPages={totalPages || 1}>
          <ProjectList projects={contents || []} />
        </PageableList>
      )}

      <NewProjectModal show={showModal} handleVisibilityChange={handleVisibilityChange} />
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
    let error;

    try {
      const accessToken = await getAccessToken(req, res, 'http://localhost:8081', ['restapi:access']);
      response = await getProjects(accessToken!);
    } catch (e) {
      // TODO: Error handling
      console.log('error: ', e);
      error = 'I ha Problem d Projekt ds ladä. Versuechs doch nomal!';
    }

    return { props: { ...response, error } };
  },
});

export default Projects;
