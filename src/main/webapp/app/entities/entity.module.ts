import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'responsibility',
        loadChildren: () => import('./responsibility/responsibility.module').then(m => m.EventPlannerResponsibilityModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EventPlannerEntityModule {}
