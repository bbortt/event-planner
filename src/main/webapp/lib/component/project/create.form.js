// @flow
import * as React from 'react';
import { useState } from 'react';

import Callout from '../../foundation/callout';
import ErrorCallout from '../../layout/message/error.callout';

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';

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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSubmit = event => {
    event.preventDefault();

    submit({
      name,
      description: description || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  };

  const changeHandler = setter => event => setter(event.target.value);
  const dateChangeHandler = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

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
          <span>Datum (Vo/Bis)</span>
          <DatePicker
            selected={startDate}
            onChange={dateChangeHandler}
            selectsRange
            startDate={startDate}
            endDate={endDate}
            showWeekNumbers
            dateFormat="dd.MM.yyyy"
          />
        </label>

        <div className="button-group align-right">
          {children && children}
          <input type="submit" className="button success" aria-label="Erstellen" value="Erstellä" />
        </div>
      </form>
    </div>
  );
};

export default ProjectCreateForm;
