// @flow
import type { Middleware } from 'redux';
import type { applicationAction, applicationDispatch, applicationState } from '../store';

const loggerMiddleware: Middleware<applicationState, applicationAction, applicationDispatch> = middleware => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    throw err;
  }
};

export default loggerMiddleware;
