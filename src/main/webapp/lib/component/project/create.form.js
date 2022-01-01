// @flow
import * as React from 'react';
import { useState } from 'react';

import Callout from '../../foundation/callout';
import ErrorCallout from '../../layout/message/error.callout';

export type projectCreateFormPropTypes = {
  children: React.ChildrenArray<React.Element<'button'>>,
  submit: (project: ProjectCreateInput) => void,
};

export const ProjectCreateForm = ({
  children,
  submit,
}: projectCreateFormPropTypes): React.Element<typeof Callout | typeof ErrorCallout | 'div'> => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleSubmit = event => {
    event.preventDefault();

    submit({
      name,
      description: description || null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });
  };

  const changeHandler = setter => event => setter(event.target.value);

  return (
    <div className="project-create-form">
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
          {<span>Start</span>}
          <input
            type="datetime-local"
            aria-describedby="Start Zeit"
            placeholder="Start"
            value={startTime}
            onChange={changeHandler(setStartTime)}
            required
          />
        </label>
        <label>
          {<span>Ändi</span>}
          <input
            type="datetime-local"
            aria-describedby="End Zeit"
            placeholder="Ändi"
            value={endTime}
            onChange={changeHandler(setEndTime)}
            required
          />
        </label>

        <div className="button-group float-right clearfix">
          {children && children}
          <input type="submit" className="button success" aria-label="Erstellen" value="Erstellä" />
        </div>
      </form>
    </div>
  );
};

export default ProjectCreateForm;
