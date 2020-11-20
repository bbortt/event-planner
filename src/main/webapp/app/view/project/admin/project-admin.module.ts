import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { ProjectAdminComponent } from 'app/view/project/admin/project-admin.component';
import { ProjectNavbarComponent } from 'app/view/project/admin/navbar/project-navbar.component';

import { ProjectLocationsComponent } from 'app/view/project/admin/locations/project-locations.component';
import { ProjectLocationUpdateComponent } from 'app/view/project/admin/locations/project-location-update.component';
import { ProjectResponsibilitiesComponent } from 'app/view/project/admin/responsibilities/project-responsibilities.component';
import { ProjectResponsibilityUpdateComponent } from 'app/view/project/admin/responsibilities/project-responsibility-update.component';
import { ProjectResponsibilityDeleteDialogComponent } from 'app/view/project/admin/responsibilities/project-responsibility-delete-dialog.component';
import { ProjectUsersComponent } from 'app/view/project/admin/users/project-users.component';

import { PROJECT_ADMIN_ROUTES } from './project-admin.routes';
import { ProjectLocationModalComponent } from 'app/view/project/admin/locations/project-location-modal.component';

@NgModule({
  imports: [EventPlannerSharedModule, RouterModule.forChild(PROJECT_ADMIN_ROUTES)],
  declarations: [
    ProjectAdminComponent,
    ProjectNavbarComponent,
    ProjectLocationsComponent,
    ProjectLocationUpdateComponent,
    ProjectLocationModalComponent,
    ProjectResponsibilitiesComponent,
    ProjectResponsibilityUpdateComponent,
    ProjectResponsibilityDeleteDialogComponent,
    ProjectUsersComponent,
  ],
  entryComponents: [ProjectAdminComponent],
})
export class EventPlannerProjectAdminModule {}
