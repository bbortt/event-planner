import { Project } from 'lib/models';

type ProjectListProps = {
  projects: Project[];
};

const ProjectList = ({ projects }: ProjectListProps) => {
  return <>{projects}</>;
};

export default ProjectList;
