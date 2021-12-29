// @flow
import * as React from 'react';
import Callout from '../../../foundation/callout';
import ErrorCallout from '../../../layout/message/error.callout';

export type locationCreateFormPropTypes = {
  children: React.ChildrenArray<React.Element<'button'>>,
  submit: (locality: CreateLocalityInput) => void,
};

export const LocalityCreateForm = ({
  children,
  submit,
}: locationCreateFormPropTypes): React.Element<typeof Callout | typeof ErrorCallout | 'div'> => {
  return <div className="locality-create-form"></div>;
};

export default LocalityCreateForm;
