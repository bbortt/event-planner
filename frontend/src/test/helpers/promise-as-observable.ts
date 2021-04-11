import { from, Observable } from 'rxjs';

export const promiseAsObservable = <T>(promiseOrObservable: Promise<T> | Observable<T>): Observable<T> => {
  if (promiseOrObservable instanceof Promise) {
    return from(promiseOrObservable);
  } else {
    return promiseOrObservable;
  }
};
