// @flow
import type { Middleware } from 'redux';
import type { applicationAction, applicationDispatch, applicationState } from '../store';

const loggerMiddleware: Middleware<applicationState, applicationAction, applicationDispatch> = middleware => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log(`next state: ${JSON.stringify(middleware.getState())}`);
  return result;
};

export default loggerMiddleware;
