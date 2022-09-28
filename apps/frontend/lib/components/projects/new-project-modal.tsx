import { useState } from 'react';

import { Button, Modal } from 'react-bootstrap';

import { ProjectApi } from 'lib/apis';
import { wrapWithContext } from 'lib/auth0';
import CreateProjectForm from 'lib/components/projects/create-project-form';
import { Project } from 'lib/models';

type NewProjectModalProps = {
  handleVisibilityChange: (project?: Project) => void;
  setErrorMessage: (errorMessage: string) => void;
  show: boolean;
};

const NewProjectModal = ({ handleVisibilityChange, setErrorMessage, show }: NewProjectModalProps) => {
  const [isValid, setIsValid] = useState(false);
  const [project, setProject] = useState({} as Project);

  const saveProject = async () => {
    if (!isValid) {
      return;
    }

    wrapWithContext(configuration => new ProjectApi(configuration))
      .createProject({ project })
      .then(
        createdProject => handleVisibilityChange(createdProject),
        _ => {
          setErrorMessage('Ha das Projekt leider ned chönne kreirä - irgendwo ischmer e Fähler passiert. Probiers doch no eis!');
          handleVisibilityChange();
        }
      );
  };

  return (
    <Modal show={show} onHide={() => handleVisibilityChange()}>
      <Modal.Header closeButton>
        <Modal.Title>Neus Projekt erstellä</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreateProjectForm setIsValid={setIsValid} setProject={setProject} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={() => handleVisibilityChange()}>
          Abbräche
        </Button>
        <Button variant="success" disabled={!isValid} onClick={() => saveProject()}>
          Spicherä
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewProjectModal;
