// @flow
import * as React from 'react';
import Callout from '../../../foundation/callout';
import ErrorCallout from '../../../layout/message/error.callout';

export type locationCreateFormPropTypes = {
  children: React.ChildrenArray<React.Element<'button'>>,
  submit: (project: Project_Insert_Input) => void,
};

export const LocationCreateForm = ({
  children,
  submit,
}: locationCreateFormPropTypes): React.Element<typeof Callout | typeof ErrorCallout | 'div'> => {
  return <div className="location-create-form"></div>;
};

export default LocationCreateForm;
