// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, takeLatest } from 'redux-saga/effects';

import type { localitiesLoadAction, localityAddAction } from '../action/locality.action';
import { localitiesLoadType, localityCreateType } from '../action/locality.action';

function* localityCreate(action: localityAddAction) {
  // TODO
}

function* localityCreateSaga(): typeof SagaIterator {
  yield takeLatest(localityCreateType, localityCreate);
}

function* localitiesLoad(action: localitiesLoadAction) {
  // TODO
}

function* localitiesLoadSaga(): typeof SagaIterator {
  yield takeLatest(localitiesLoadType, localitiesLoad);
}

export default function* localitySaga(): typeof SagaIterator {
  yield all([localityCreateSaga(), localitiesLoadSaga()]);
}
