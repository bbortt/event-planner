// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { projectCreate } from '../../redux/action/project.action';

import ProjectCreateForm from './create.form';
import renderFoundationNode from '../../foundation/render-foundation-node';

export type newProjectRevealPropTypes = {
  revealId: string,
};

export const NewProjectReveal = ({ revealId }: newProjectRevealPropTypes): React.Element<'div'> => {
  const [key, setKey] = useState(0);
  // $FlowFixMe
  useEffect(() => $(document).on('open.zf.reveal', () => setKey(k => k + 1)), []);

  const dispatch = useDispatch();

  const submit = (project: ProjectCreateInput) => {
    dispatch(projectCreate(project));
    // $FlowFixMe
    jQuery(`#${revealId}`).foundation('close');
  };

  return (
    <div ref={renderFoundationNode} className="new-project-reveal reveal" id={revealId} data-reveal="true">
      <h3>Neus Projekt</h3>

      <ProjectCreateForm submit={submit} key={key}>
        <button type="button" className="button warning" data-close={revealId} aria-label="Aktion abbrechen">
          Abbräche
        </button>
      </ProjectCreateForm>
    </div>
  );
};

export default NewProjectReveal;
