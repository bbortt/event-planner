// @flow
import { SagaIterator } from '@redux-saga/core';
import { all, delay, put, takeLatest } from 'redux-saga/effects';

import { hasuraMutation, hasuraQuery } from '../../apollo/hasura-utils';
import { ProjectInsertMutation } from '../../apollo/mutation/project.mutation';
import { ProjectQuery } from '../../apollo/query/project.query';

import { allProjectPermissions } from '../../model/project-permission';

import { memberApprove } from '../action/member.action';
import type { projectCreateAction, projectsLoadAction } from '../action/project.action';
import {
  projectAdd,
  projectCreateType,
  projectsSet,
  projectsLoad as projectsLoadDispatch,
  projectsLoadType,
} from '../action/project.action';
import { messageAdd } from '../action/message.action';

function* projectCreate(action: projectCreateAction) {
  const { project, user } = action.payload;

  const projectInsertInput = ((project: any): Project_Insert_Input);

  // Immediately add membership and default permissions
  const permissionData = allProjectPermissions.map(permission => ({ id: permission }));
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
    const { data } = yield hasuraMutation<{ insert_project_one: Project }>(ProjectInsertMutation, { project: projectInsertInput });
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
    const { data } = yield hasuraQuery<{ project: Project[] }>(ProjectQuery);
    yield put(projectsSet(data.project || []));
  } catch (error) {
    const { isRetry } = action.payload;
    if (!isRetry) {
      yield put(messageAdd('alert', error.message, 'Projekt ladä isch fählgschlage - i probieres im Hintergrund witer!'));
    }

    yield delay(1000);
    yield put(projectsLoadDispatch(true));
  }
}

function* projectsLoadSaga(): typeof SagaIterator {
  yield takeLatest(projectsLoadType, projectsLoad);
}

export default function* projectSaga(): typeof SagaIterator {
  yield all([projectCreateSaga(), projectsLoadSaga()]);
}
