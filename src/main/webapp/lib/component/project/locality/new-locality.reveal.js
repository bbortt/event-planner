// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { localityCreate } from '../../../model/project-permission';

import LocalityCreateForm from './create.form';
import renderFoundationNode from '../../../foundation/render-foundation-node';
import { projectByIdSelector } from '../../../redux/selector/project.selector';

export type newLocationRevealPropTypes = {
  revealId: string,
};

export const NewLocalityReveal = ({ revealId }: newLocationRevealPropTypes): React.Element<'div'> => {
  const [key, setKey] = useState(0);
  // $FlowFixMe
  useEffect(() => $(document).on('open.zf.reveal', () => setKey(k => k + 1)), []);

  const router = useRouter();
  const project = useSelector(projectByIdSelector(router.query.projectId)) || {};

  const dispatch = useDispatch();

  const submit = (locality: LocalityCreateInput) => {
    dispatch(localityCreate(project, locality));
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
