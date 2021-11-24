// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, put, takeLatest } from 'redux-saga/effects';

import { getApolloClient } from '../../apollo/client';
import { ProjectInsertMutation } from '../../apollo/mutation/project.mutation';
import { ListProjectsQuery } from '../../apollo/query/project.query';

import { allProjectPermissions } from '../../model/project-permission';

import { memberApprove } from '../action/member.action';
import type { projectCreateAction, projectsLoadAction } from '../action/project.action';
import { projectAdd, projectCreateType, projectsLoadType, projectsSet } from '../action/project.action';
import { messageAdd } from '../action/message.action';

function* projectCreate(action: projectCreateAction) {
  const { project, user } = action.payload;

  const projectInsertInput = ((project: any): Project_Insert_Input);

  // Immediately add membership and default permissions
  const permissionData = allProjectPermissions.map(permission => ({ permission_id: permission }));

  console.log('permissionData: ', permissionData);

  projectInsertInput.members = {
    data: [
      {
        permissions: {
          data: permissionData,
        },
      },
    ],
  };

  try {
    const { data } = yield getApolloClient().mutate<{ insert_project_one: Project }>(ProjectInsertMutation, {
      project: projectInsertInput,
    });
    const createdProject: Project = data.insert_project_one;
    for (let member of createdProject.members) {
      yield put(memberApprove(member.id));
    }
    yield put(projectAdd(createdProject));
  } catch (error) {
    yield put(messageAdd('alert', error.message, 'Projekt erstellä isch fählgschlage!'));
  }
}

function* projectCreateSaga(): typeof SagaIterator {
  yield takeLatest(projectCreateType, projectCreate);
}

function* projectsLoad(action: projectsLoadAction) {
  try {
    const { data } = yield getApolloClient().query<{ project: Project[] }>({ query: ListProjectsQuery });
    yield put(projectsSet(data.project || []));
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
