// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, put, takeLatest } from 'redux-saga/effects';

import { getApolloClient } from '../../apollo/client';
import { CreateProjectMutation } from '../../apollo/mutation/project.mutation';
import { ListProjectsQuery } from '../../apollo/query/project.query';

import type { projectCreateAction, projectsLoadAction } from '../action/project.action';
import { projectAdd, projectCreateType, projectsLoadType, projectsSet } from '../action/project.action';
import { messageAdd } from '../action/message.action';

function* projectCreate(action: projectCreateAction) {
  const { project } = action.payload;

  try {
    const { data } = yield getApolloClient().mutate<{ createProject: Project }>({
      mutation: CreateProjectMutation,
      variables: { project },
    });
    const createProject: Project = data.createProject;
    yield put(projectAdd(createProject));
    yield put(messageAdd('success', `Projekt "${createProject.name}" erstellt.`));
  } catch (error) {
    yield put(messageAdd('alert', error.message, 'Projekt erstellä isch fählgschlage!'));
  }
}

function* projectCreateSaga(): typeof SagaIterator {
  yield takeLatest(projectCreateType, projectCreate);
}

function* projectsLoad(action: projectsLoadAction) {
  try {
    const { data } = yield getApolloClient().query<{ listProjects: Project[] }>({ query: ListProjectsQuery });
    yield put(projectsSet(data.listProjects || []));
  } catch (error) {
    yield put(messageAdd('alert', error.message, 'Projekt ladä isch fählgschlage - due doch d Sitä mal neu Ladä!'));
  }
}

function* projectsLoadSaga(): typeof SagaIterator {
  yield takeLatest(projectsLoadType, projectsLoad);
}

export default function* projectSaga(): typeof SagaIterator {
  yield all([projectCreateSaga(), projectsLoadSaga()]);
}
