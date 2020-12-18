import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxAutocompleteModule } from '@bbortt/ngx-autocomplete';

import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { ProjectAdminComponent } from 'app/view/project/admin/project-admin.component';
import { ProjectAdminUpdateComponent } from 'app/view/project/admin/project-admin-update.component';
import { ProjectAdminUpdateModalComponent } from 'app/view/project/admin/project-admin-update-modal.component';
import { ProjectNavbarComponent } from 'app/view/project/admin/navbar/project-navbar.component';

import { ProjectLocationsComponent } from 'app/view/project/admin/locations/project-locations.component';
import { ProjectLocationUpdateComponent } from 'app/view/project/admin/locations/project-location-update.component';
import { ProjectLocationModalComponent } from 'app/view/project/admin/locations/project-location-modal.component';
import { ProjectLocationDeleteDialogComponent } from 'app/view/project/admin/locations/project-location-delete-dialog.component';
import { ProjectSectionUpdateComponent } from 'app/view/project/admin/locations/sections/project-section-update.component';
import { ProjectSectionDeleteDialogComponent } from 'app/view/project/admin/locations/sections/project-section-delete-dialog.component';
import { ProjectSectionModalComponent } from 'app/view/project/admin/locations/sections/project-section-modal.component';
import { ProjectResponsibilitiesComponent } from 'app/view/project/admin/responsibilities/project-responsibilities.component';
import { ProjectResponsibilityUpdateComponent } from 'app/view/project/admin/responsibilities/project-responsibility-update.component';
import { ProjectResponsibilityDeleteDialogComponent } from 'app/view/project/admin/responsibilities/project-responsibility-delete-dialog.component';
import { ProjectUsersComponent } from 'app/view/project/admin/users/project-users.component';

import { PROJECT_ADMIN_ROUTES } from './project-admin.routes';
import { ProjectUserInviteComponent } from 'app/view/project/admin/users/project-user-invite.component';

@NgModule({
  imports: [EventPlannerSharedModule, NgxAutocompleteModule, RouterModule.forChild(PROJECT_ADMIN_ROUTES)],
  declarations: [
    ProjectAdminComponent,
    ProjectAdminUpdateModalComponent,
    ProjectAdminUpdateComponent,
    ProjectNavbarComponent,
    ProjectLocationsComponent,
    ProjectLocationUpdateComponent,
    ProjectLocationModalComponent,
    ProjectLocationDeleteDialogComponent,
    ProjectSectionUpdateComponent,
    ProjectSectionModalComponent,
    ProjectSectionDeleteDialogComponent,
    ProjectResponsibilitiesComponent,
    ProjectResponsibilityUpdateComponent,
    ProjectResponsibilityDeleteDialogComponent,
    ProjectUsersComponent,
    ProjectUserInviteComponent,
  ],
  entryComponents: [ProjectAdminComponent],
})
export class EventPlannerProjectAdminModule {}
