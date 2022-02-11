// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { localityCreate } from '../../../redux/action/locality.action';
import { projectByIdSelector } from '../../../redux/selector/project.selector';

import LocalityCreateForm from './create.form';

import renderFoundationNode from '../../../foundation/render-foundation-node';

export type newLocationRevealPropTypes = {
  parentLocality?: Locality,
  revealId: string,
};

export const NewLocalityReveal = ({ parentLocality, revealId }: newLocationRevealPropTypes): React.Element<'div'> => {
  const [key, setKey] = useState(0);
  const [ref, setRef] = useState();

  useEffect(() => {
    if (ref) renderFoundationNode(ref);
  }, [key, ref]);

  const router = useRouter();
  const project = useSelector(projectByIdSelector(router.query.projectId)) || {};

  const dispatch = useDispatch();

  const submit = (locality: LocalityCreateInput) => {
    locality.parentLocalityId = parentLocality?.id;
    dispatch(localityCreate(project, locality));

    // $FlowFixMe
    jQuery(`#${revealId}`).foundation('close');
    setKey(k => k + 1);
  };

  return (
    <div ref={setRef} className="new-project-locality-reveal reveal" id={revealId} data-reveal="true">
      <h3>Neui Lokalität</h3>

      <LocalityCreateForm parent={parentLocality} submit={submit} key={key}>
        <button type="button" className="button warning" data-close={revealId} aria-label="Aktion abbrechen">
          Abbräche
        </button>
      </LocalityCreateForm>
    </div>
  );
};

export default NewLocalityReveal;
