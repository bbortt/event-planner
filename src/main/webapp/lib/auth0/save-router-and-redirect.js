// @flow
import * as React from 'react';

import type { Router } from 'next/router';
import { useRouter } from 'next/router';

import { LOCAL_STORAGE_ROUTER_PATH } from '../constants';

import LoadingCallout from '../layout/message/loading.callout';

const saveRouterState = router => localStorage.setItem(LOCAL_STORAGE_ROUTER_PATH, router.asPath);

const saveRouterAndRedirect = (): React.Element<typeof LoadingCallout> => {
  saveRouterState(useRouter());
  return <LoadingCallout />;
};

export default saveRouterAndRedirect;
