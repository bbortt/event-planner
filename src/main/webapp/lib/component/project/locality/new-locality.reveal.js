// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { projectCreate } from '../../../redux/action/project.action';

import LocalityCreateForm from './create.form';
import renderFoundationNode from '../../../foundation/render-foundation-node';

export type newLocationRevealPropTypes = {
  revealId: string,
};

export const NewLocalityReveal = ({ revealId }: newLocationRevealPropTypes): React.Element<'div'> => {
  const [key, setKey] = useState(0);
  // $FlowFixMe
  useEffect(() => $(document).on('open.zf.reveal', () => setKey(k => k + 1)), []);

  const dispatch = useDispatch();

  const submit = (locality: CreateLocalityInput) => {
    // TODO: use Location_Insert_Input
    // dispatch(projectCreate(project));
    // $FlowFixMe
    jQuery(`#${revealId}`).foundation('close');
  };

  return (
    <div ref={renderFoundationNode} className="new-project-locality-reveal reveal" id={revealId} data-reveal="true">
      <h3>Neui Lokalität</h3>

      <LocalityCreateForm submit={submit} key={key}>
        <button type="button" className="button warning" data-close={revealId} aria-label="Aktion abbrechen">
          Abbräche
        </button>
      </LocalityCreateForm>
    </div>
  );
};

export default NewLocalityReveal;
