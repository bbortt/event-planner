// @flow
import * as React from 'react';
import Callout from '../../../foundation/callout';
import ErrorCallout from '../../../layout/message/error.callout';
import { useState } from 'react';

export type locationCreateFormPropTypes = {
  children: React.ChildrenArray<React.Element<'button'>>,
  parent?: Locality,
  submit: (locality: LocalityCreateInput) => void,
};

export const LocalityCreateForm = ({
  children,
  parent,
  submit,
}: locationCreateFormPropTypes): React.Element<typeof Callout | typeof ErrorCallout | 'div'> => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = event => {
    event.preventDefault();

    submit({
      name,
      description: description || null,
    });
  };

  const changeHandler = setter => event => setter(event.target.value);

  return (
    <div className="locality-create-form">
      <form onSubmit={handleSubmit}>
        <label>
          <span>Name</span>
          <input type="text" aria-describedby="Name" placeholder="Name" value={name} onChange={changeHandler(setName)} required />
        </label>
        <label>
          <span>Beschribig</span>
          <textarea aria-describedby="Beschreibung" placeholder="Beschribig" value={description} onChange={changeHandler(setDescription)} />
        </label>
        <label>
          <span>Mami</span>
          <input type="text" aria-describedby="Eltern-Lokalität" placeholder="Mami" value={parent ? parent.name : 'Kes Mami'} readOnly />
        </label>

        <div className="button-group align-right">
          {children && children}
          <input type="submit" className="button success" aria-label="Erstellen" value="Erstellä" />
        </div>
      </form>
    </div>
  );
};

export default LocalityCreateForm;
