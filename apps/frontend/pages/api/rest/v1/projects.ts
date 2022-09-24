import auth0, { getAccessToken } from 'lib/auth0';
import { ProjectApi } from 'lib/apis';
import { Project, ProjectFromJSON, ProjectToJSON } from 'lib/models';

const createProject = async (project: Project, accessToken: String) =>
  await new ProjectApi().createProject(
    { project },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

const projects = auth0.withApiAuthRequired(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }

  try {
    const accessToken = await getAccessToken(req, res, 'http://localhost:8081', ['restapi:access']);
    const project = await createProject(ProjectFromJSON(JSON.parse(req.body)), accessToken);
    res.status(201).json(JSON.stringify(ProjectToJSON(project)));
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).end(errorMessage);
  }
});

export default projects;
