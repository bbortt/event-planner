import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'project',
        data: { pageTitle: 'app.project.home.title' },
        loadChildren: () => import('./project/project.routes'),
      },
      {
        path: 'member',
        data: { pageTitle: 'app.member.home.title' },
        loadChildren: () => import('./member/member.routes'),
      },
      {
        path: 'location',
        data: { pageTitle: 'app.location.home.title' },
        loadChildren: () => import('./location/location.routes'),
      },
      {
        path: 'event',
        data: { pageTitle: 'app.event.home.title' },
        loadChildren: () => import('./event/event.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
