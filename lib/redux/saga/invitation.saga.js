// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, put, takeLatest } from 'redux-saga/effects';

import { hasuraMutation } from '../../apollo/hasura-utils';
import { AcceptInvitationMutation } from '../../apollo/mutation/invitation.mutation';

import type { invitationAcceptAction } from '../action/invitation.action';
import { invitationAcceptType } from '../action/invitation.action';
import { messageAdd } from '../action/message.action';

function* invitationAccept(action: invitationAcceptAction) {
  const { token, user } = action.payload;

  const payload: Invitation_Set_Input = {
    accepted: true,
    auth0_user_id: user.sub,
  };

  try {
    const result = yield hasuraMutation<{ update_invitation: Invitation }>(AcceptInvitationMutation, { token, changes: payload });
    const projectName = result.data.update_invitation.invited_to.name;
    yield put(messageAdd('success', `Du chasch etz am Projekt ${projectName} mitmache!`, 'Projekt erfolgrich biträtte!'));
  } catch (error) {
    yield put(messageAdd('alert', error.message, 'Iladig akzeptierä isch fählgschlage!'));
  }
}

function* invitationAcceptSaga(): typeof SagaIterator {
  yield takeLatest(invitationAcceptType, invitationAccept);
}

export default function* invitationSaga(): typeof SagaIterator {
  yield all([invitationAcceptSaga()]);
}
