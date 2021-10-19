// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, call, spawn } from 'redux-saga/effects';

import invitationSaga from './invitation.saga';
import messageSaga from './message.saga';
import projectSaga from './project.saga';

const sagas = [invitationSaga, messageSaga, projectSaga];

function* spawnFailsafeSagas(sagas: typeof SagaIterator[]): typeof SagaIterator {
  yield all(
    sagas.map((saga: typeof SagaIterator) =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            // TODO: Propper error handling
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
