import { FormGroup } from '@angular/forms';

import { Responsibility } from 'app/entities/responsibility/responsibility.model';

const responsibilityOrUserFromForm = (
  editForm: FormGroup,
  isResponsibility: boolean
): { responsibility?: Responsibility; jhiUserId?: string } => {
  let responsibility;
  let jhiUserId;

  if (isResponsibility) {
    responsibility = editForm.get(['responsibilityAutocomplete'])!.value ? editForm.get(['responsibility'])!.value : null;
    jhiUserId = null;
  } else {
    responsibility = null;
    jhiUserId = editForm.get(['userAutocomplete'])!.value ? editForm.get(['jhiUserId'])!.value : null;
  }

  return { responsibility, jhiUserId };
};

export default responsibilityOrUserFromForm;
