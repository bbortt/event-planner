import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { ProjectAdminComponent } from 'app/view/project/admin/project-admin.component';
import { ProjectNavbarComponent } from 'app/view/project/admin/navbar/project-navbar.component';
import { LocationsComponent } from 'app/view/project/admin/locations/locations.component';
import { ResponsibilitiesComponent } from 'app/view/project/admin/responsibilities/responsibilities.component';
import { UsersComponent } from 'app/view/project/admin/users/users.component';

import { PROJECT_ADMIN_ROUTES } from './project-admin.routes';

@NgModule({
  imports: [EventPlannerSharedModule, RouterModule.forChild(PROJECT_ADMIN_ROUTES)],
  declarations: [ProjectAdminComponent, ProjectNavbarComponent, LocationsComponent, ResponsibilitiesComponent, UsersComponent],
  entryComponents: [ProjectAdminComponent],
})
export class EventPlannerProjectAdminModule {}
