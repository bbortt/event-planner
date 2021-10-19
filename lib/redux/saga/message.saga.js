// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, delay, put, takeEvery } from 'redux-saga/effects';

import type { messageAddAction } from '../action/message.action';
import { messageAddType, messageDelete } from '../action/message.action';

function* messageAdd(action: messageAddAction) {
  const { message } = action.payload;
  yield delay(3000);
  yield put(messageDelete(message.id));
}

function* messageAddSaga(): typeof SagaIterator {
  yield takeEvery(messageAddType, messageAdd);
}

export default function* messageSaga(): typeof SagaIterator {
  yield all([messageAddSaga()]);
}
