// @flow
import type { Action, Dispatch, Store } from 'redux';
import { applyMiddleware, createStore } from 'redux';

import { createWrapper } from 'next-redux-wrapper';

import { SagaIterator } from '@redux-saga/core';
import createSagaMiddleware from 'redux-saga';

import type { projectAction } from './action/project.action';

import loggerMiddleware from './middleware/logger.middleware';
import crashReportingMiddleware from './middleware/crash-reporting.middleware';

import type { messagesState } from './reducer/messages.reducer';
import type { projectsState } from './reducer/projects.reducer';

import reducer from './reducer';
import rootSaga from './saga';

export type applicationState = {
  messages: messagesState,
  projects: projectsState,
};

export type applicationAction = Action<projectAction>;
export type applicationDispatch = Dispatch<applicationAction>;
type applicationStore = Store<applicationState, applicationAction, applicationDispatch>;

const makeStore = (context): applicationStore => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducer, applyMiddleware(loggerMiddleware, crashReportingMiddleware, sagaMiddleware));
  const sagaTask = sagaMiddleware.run(rootSaga);

  if ((module: any).hot) {
    hotReload(store, sagaMiddleware, sagaTask);
  }

  return store;
};

const hotReload = (store: applicationStore, sagaMiddleware, sagaTask: typeof SagaIterator) => {
  (module: any).hot.accept('./reducer', () => {
    console.log('hot replacing reducers..');
    const reducer = require('./reducer');
    store.replaceReducer(reducer);
  });
  (module: any).hot.accept('./saga', () => {
    console.log('hot replacing saga..');
    const rootSaga: typeof SagaIterator = require('./saga');
    sagaTask.cancel();
    sagaTask.done.then(() => {
      sagaTask = sagaMiddleware.run(rootSaga);
    });
  });
};

export const wrapper: { withRedux: <T>(element: T) => T } = createWrapper(makeStore);
