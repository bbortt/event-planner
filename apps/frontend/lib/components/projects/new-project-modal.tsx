import { useState } from 'react';

import { Button, Modal } from 'react-bootstrap';

import CreateProjectForm from 'lib/components/projects/create-project-form';
import { Project } from 'lib/models';

type NewProjectModalProps = {
  show: boolean;
  handleVisibilityChange: () => void;
};

const NewProjectModal = ({ show, handleVisibilityChange }: NewProjectModalProps) => {
  const [isValid, setIsValid] = useState(false);
  const [project, setProject] = useState({} as Project);

  const saveProject = (project: Project) => {
    if (!isValid) {
      return;
    }

    console.log('project: ', project);
    handleVisibilityChange();
  };

  return (
    <Modal show={show} onHide={handleVisibilityChange}>
      <Modal.Header closeButton>
        <Modal.Title>Neus Projekt erstellä</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreateProjectForm setIsValid={setIsValid} setProject={setProject} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={handleVisibilityChange}>
          Abbräche
        </Button>
        <Button variant="success" disabled={!isValid} onClick={() => saveProject(project)}>
          Spicherä
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewProjectModal;
