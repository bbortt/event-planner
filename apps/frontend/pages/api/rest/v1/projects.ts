import auth0, { getAccessToken } from 'lib/auth0';
import { ProjectApi } from 'lib/apis';
import { Project, ProjectFromJSON, ProjectToJSON } from 'lib/models';

const createProject = async (project: Project, accessToken: String) =>
  await new ProjectApi().createProject({ project }, async ({ context }) => ({
    headers: {
      ...context.headers,
      Authorization: `bearer ${accessToken}`,
    },
  }));

const projects = auth0.withApiAuthRequired(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }

  try {
    const accessToken = await getAccessToken(req, res, 'http://localhost:8081', ['restapi:access']);
    // console.log('req.body: ', req.body)
    let project = ProjectFromJSON(req.body);
    project = await createProject(project, accessToken);
    res.status(201).json(project);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(error.response.status).end(errorMessage);
  }
});

export default projects;
