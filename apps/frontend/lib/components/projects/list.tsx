import { Project } from 'lib/models';

type ProjectListProps = {
  projects: Project[];
};

const ProjectList = ({ projects }: ProjectListProps) => {
  console.log('projects: ', projects);

  return (
    <>
      <h1>Projekt</h1>

      {projects}
    </>
  );
};

export default ProjectList;
