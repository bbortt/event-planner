// @flow
import type { Middleware } from 'redux';
import type { applicationAction, applicationDispatch, applicationState } from '../store';

const crashReportingMiddleware: Middleware<applicationState, applicationAction, applicationDispatch> = middleware => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    throw err;
  }
};

export default crashReportingMiddleware;
