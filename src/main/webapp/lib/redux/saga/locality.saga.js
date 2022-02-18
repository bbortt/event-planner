// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, put, takeLatest } from 'redux-saga/effects';

import { getApolloClient } from '../../apollo/client';
import { CreateLocalityMutation, UpdateLocalityMutation } from '../../apollo/mutation/locality.mutation';
import { ListLocalitiesQuery } from '../../apollo/query/locality.query';

import type { localitiesLoadAction, localityCreateAction, localityUpdateAction } from '../action/locality.action';
import { localitiesLoadType, localityAdd, localityCreateType, localityUpdateType } from '../action/locality.action';
import { messageAdd } from '../action/message.action';

function* localityCreate(action: localityCreateAction) {
  const { locality, project } = action.payload;

  try {
    const { data } = yield getApolloClient().mutate<{ createLocality: Locality }, { projectId: number, locality: LocalityCreateInput }>({
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

function* localityUpdate(action: localityUpdateAction) {
  const { locality } = action.payload;
  const { id, name, description, newParentLocalityId } = locality;

  try {
    const { data } = yield getApolloClient().mutate<{ updateLocality: Locality }, { locality: LocalityCreateInput }>({
      mutation: UpdateLocalityMutation,
      variables: { locality: { id, name, description, newParentLocalityId } },
    });
    const updateLocality: Locality = data.updateLocality;
    yield put(localityAdd(updateLocality));
    yield put(messageAdd('success', `Lokalität "${updateLocality.name}" aktualisiert.`));
  } catch (error) {
    yield put(messageAdd('alert', error.message, 'Lokalität aktualisierä isch fählgschlage!'));
  }
}

function* localityUpdateSaga(): typeof SagaIterator {
  yield takeLatest(localityUpdateType, localityUpdate);
}

function* localitiesLoad(action: localitiesLoadAction) {
  const { project, parent } = action.payload;

  try {
    const { data } = yield getApolloClient().query<{ listLocalities: Locality[] }, { projectId: number, parentLocalityId: number }>({
      query: ListLocalitiesQuery,
      variables: {
        projectId: project.id,
        parentLocalityId: parent?.id,
      },
    });

    // TODO: Do I have to make sure all parents are available?
    yield all((data.listLocalities || []).map(locality => put(localityAdd(locality))));
  } catch (error) {
    yield put(messageAdd('alert', error.message, 'Lokalitäte ladä isch fählgschlage - due doch d Sitä mal neu Ladä!'));
  }
}

function* localitiesLoadSaga(): typeof SagaIterator {
  yield takeLatest(localitiesLoadType, localitiesLoad);
}

export default function* localitySaga(): typeof SagaIterator {
  yield all([localityCreateSaga(), localityUpdateSaga(), localitiesLoadSaga()]);
}
