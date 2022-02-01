// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, call, spawn } from 'redux-saga/effects';

import localitySaga from './locality.saga';
import memberSaga from './member.saga';
import messageSaga from './message.saga';
import projectSaga from './project.saga';

const sagas = [localitySaga, memberSaga, messageSaga, projectSaga];

function* spawnFailsafeSagas(sagas: typeof SagaIterator[]): typeof SagaIterator {
  yield all(
    sagas.map((saga: typeof SagaIterator) =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            // TODO: Proper error handling
            console.log(e);
          }
        }
      })
    )
  );
}

export default function* rootSaga(): typeof SagaIterator {
  yield spawnFailsafeSagas(sagas);
}
