// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import { useAuth0 } from '@auth0/auth0-react';

import { projectCreate } from '../../../redux/action/project.action';

import LocationCreateForm from './create.form';
import renderFoundationNode from '../../../foundation/render-foundation-node';

export type newLocationRevealPropTypes = {
  revealId: string,
};

export const NewLocationReveal = ({ revealId }: newLocationRevealPropTypes): React.Element<'div'> => {
  const [key, setKey] = useState(0);
  // $FlowFixMe
  useEffect(() => $(document).on('open.zf.reveal', () => setKey(k => k + 1)), []);

  const { user } = useAuth0();
  const dispatch = useDispatch();

  // TODO: use Location_Insert_Input
  const submit = (project: any) => {
    dispatch(projectCreate(project, user));
    // $FlowFixMe
    jQuery(`#${revealId}`).foundation('close');
  };

  return (
    <div ref={renderFoundationNode} className="new-project-reveal reveal" id={revealId} data-reveal="true">
      <h3>Neui Lokalität</h3>

      <LocationCreateForm submit={submit} key={key}>
        <button type="button" className="button warning" data-close={revealId} aria-label="Aktion abbrechen">
          Abbräche
        </button>
      </LocationCreateForm>
    </div>
  );
};

export default NewLocationReveal;
