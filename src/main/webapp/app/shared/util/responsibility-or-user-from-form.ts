import { FormGroup } from '@angular/forms';

import { Responsibility } from 'app/shared/model/responsibility.model';
import { User } from 'app/core/user/user.model';

const responsibilityOrUserFromForm = (editForm: FormGroup, isResponsibility: boolean): { responsibility?: Responsibility; user?: User } => {
  let responsibility;
  let user;

  if (isResponsibility) {
    responsibility = editForm.get(['responsibilityAutocomplete'])!.value ? editForm.get(['responsibility'])!.value : null;
    user = null;
  } else {
    responsibility = null;
    user = editForm.get(['userAutocomplete'])!.value ? editForm.get(['user'])!.value : null;
  }

  return { responsibility, user };
};

export default responsibilityOrUserFromForm;
