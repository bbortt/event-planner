import { Route } from '@angular/router';

import { projectFromParentRoute } from '../admin/route/project-from-parent.resolve';

import { ProjectCalendarComponent } from './project-calendar.component';

export const PROJECT_CALENDAR_ROUTES: Route[] = [
  {
    path: '',
    component: ProjectCalendarComponent,
    resolve: {
      project: projectFromParentRoute,
    },
  },
];
