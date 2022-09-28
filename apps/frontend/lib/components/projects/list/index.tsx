import { Project } from 'lib/models';

type ProjectListProps = {
  projects: Project[];
};

const ProjectList = ({ projects }: ProjectListProps) => {
  return <>{JSON.stringify(projects)}</>;
};

export default ProjectList;
