import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'responsibility',
        loadChildren: () => import('./responsibility/responsibility.module').then(m => m.EventPlannerResponsibilityModule),
      },
      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then(m => m.EventPlannerProjectModule),
      },
      {
        path: 'role',
        loadChildren: () => import('./role/role.module').then(m => m.EventPlannerRoleModule),
      },
      {
        path: 'invitation',
        loadChildren: () => import('./invitation/invitation.module').then(m => m.EventPlannerInvitationModule),
      },
      {
        path: 'location',
        loadChildren: () => import('./location/location.module').then(m => m.EventPlannerLocationModule),
      },
      {
        path: 'section',
        loadChildren: () => import('./section/section.module').then(m => m.EventPlannerSectionModule),
      },
      {
        path: 'event',
        loadChildren: () => import('./event/event.module').then(m => m.EventPlannerEventModule),
      },
      {
        path: 'location-time-slot',
        loadChildren: () => import('./location-time-slot/location-time-slot.module').then(m => m.EventPlannerLocationTimeSlotModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EventPlannerEntityModule {}
