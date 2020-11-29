import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from '../shared/shared.module';
import { NgxAutocompleteModule } from '@bbortt/ngx-autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatetimeAdapter, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule, MomentDatetimeAdapter } from '@mat-datetimepicker/moment';

import { HomeComponent } from './home.component';
import { MyProjectsComponent } from 'app/view/my-projects/my-projects.component';

import { ProjectCreateComponent } from 'app/view/create-project/project-create.component';
import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';
import { ProjectResponsibilityModalComponent } from 'app/view/project/admin/responsibilities/project-responsibility-modal.component';

import { VIEW_ROUTES } from './view.routes';

@NgModule({
  imports: [
    EventPlannerSharedModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatMomentDatetimeModule,
    NgxAutocompleteModule,
    RouterModule.forChild(VIEW_ROUTES),
  ],
  providers: [
    {
      provide: DatetimeAdapter,
      useClass: MomentDatetimeAdapter,
    },
  ],
  declarations: [
    HomeComponent,
    MyProjectsComponent,
    ProjectCreateComponent,
    CreateProjectModalComponent,
    ProjectResponsibilityModalComponent,
  ],
  entryComponents: [HomeComponent],
})
export class EventPlannerViewModule {}
