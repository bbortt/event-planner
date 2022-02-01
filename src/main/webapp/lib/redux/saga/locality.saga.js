// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, put, takeLatest } from 'redux-saga/effects';

import { getApolloClient } from '../../apollo/client';
import { CreateLocalityMutation } from '../../apollo/mutation/locality.mutation';
import { ListLocalitiesQuery } from '../../apollo/query/locality.query';

import type { localitiesLoadAction, localityCreateAction } from '../action/locality.action';
import { localitiesLoadType, localityAdd, localityCreateType } from '../action/locality.action';
import { messageAdd } from '../action/message.action';

function* localityCreate(action: localityCreateAction) {
  const { project, locality } = action.payload;

  try {
    const { data } = yield getApolloClient().mutate<{ createLocality: Locality }>({
      mutation: CreateLocalityMutation,
      variables: { projectId: project.id, locality },
    });
    const createLocality: Locality = data.createLocality;
    yield put(localityAdd(createLocality));
    yield put(messageAdd('success', `Lokalität "${createLocality.name}" erstellt.`));
  } catch (error) {
    yield put(messageAdd('alert', error.message, 'Lokalität erstellä isch fählgschlage!'));
  }
}

function* localityCreateSaga(): typeof SagaIterator {
  yield takeLatest(localityCreateType, localityCreate);
}

function* localitiesLoad(action: localitiesLoadAction) {
  const { project, parent } = action;

  console.log('localitiesLoadAction: ', action);

  try {
    const { data } = yield getApolloClient().query<{ listLocalities: Locality[] }>({
      query: ListLocalitiesQuery,
      variables: {
        projectId: project?.id,
        parentLocalityId: parent?.id,
      },
    });
    (data.listLocalities || []).forEach(locality => put(localityAdd(locality)));
  } catch (error) {
    yield put(messageAdd('alert', error.message, 'Lokalitäte ladä isch fählgschlage - due doch d Sitä mal neu Ladä!'));
  }
}

function* localitiesLoadSaga(): typeof SagaIterator {
  yield takeLatest(localitiesLoadType, localitiesLoad);
}

export default function* localitySaga(): typeof SagaIterator {
  yield all([localityCreateSaga(), localitiesLoadSaga()]);
}
