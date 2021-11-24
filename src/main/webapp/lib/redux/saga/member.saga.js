// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, put, takeLatest } from 'redux-saga/effects';

import { getApolloClient } from '../../apollo/client';
import { MemberApproveMutation } from '../../apollo/mutation/member.mutation';

import type { memberApproveAction } from '../action/member.action';
import { memberApproveType } from '../action/member.action';
import { messageAdd } from '../action/message.action';

function* memberApprove(action: memberApproveAction) {
  const { id } = action.payload;

  const payload: Member_Set_Input = {
    accepted: true,
  };

  try {
    const result = yield getApolloClient().mutate<{ update_member: Member }>(MemberApproveMutation, { id, changes: payload });
    const member = result.data.update_member;
    const projectName = member.project.name;
    const nickname = member.user.nickname;
    yield put(messageAdd('success', `${nickname} isch etz Teil vom Projekt ${projectName}!`, 'Member akzeptiert!'));
  } catch (error) {
    yield put(messageAdd('alert', error.message, 'Iladig akzeptierä isch fählgschlage!'));
  }
}

function* memberApproveSaga(): typeof SagaIterator {
  yield takeLatest(memberApproveType, memberApprove);
}

export default function* memberSaga(): typeof SagaIterator {
  yield all([memberApproveSaga()]);
}
