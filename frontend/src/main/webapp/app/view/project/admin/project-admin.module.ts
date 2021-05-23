import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { DxAutocompleteModule, DxColorBoxModule, DxDateBoxModule } from 'devextreme-angular';

import { ProjectAdminComponent } from 'app/view/project/admin/project-admin.component';
import { ProjectAdminUpdateComponent } from 'app/view/project/admin/project-admin-update.component';
import { ProjectAdminUpdateModalComponent } from 'app/view/project/admin/project-admin-update-modal.component';

import { ProjectAdminNavbarComponent } from 'app/view/project/admin/navbar/project-admin-navbar.component';

import { ProjectEventsHistoryComponent } from 'app/view/project/admin/history/project-events-history.component';

import { ProjectLocationsComponent } from 'app/view/project/admin/locations/project-locations.component';
import { ProjectLocationUpdateComponent } from 'app/view/project/admin/locations/project-location-update.component';
import { ProjectLocationModalComponent } from 'app/view/project/admin/locations/project-location-modal.component';
import { ProjectLocationDeleteDialogComponent } from 'app/view/project/admin/locations/project-location-delete-dialog.component';
import { ProjectSectionUpdateComponent } from 'app/view/project/admin/locations/sections/project-section-update.component';
import { ProjectSectionModalComponent } from 'app/view/project/admin/locations/sections/project-section-modal.component';
import { ProjectSectionDeleteDialogComponent } from 'app/view/project/admin/locations/sections/project-section-delete-dialog.component';

import { ProjectUsersComponent } from 'app/view/project/admin/users/project-users.component';
import { ProjectUserInviteComponent } from 'app/view/project/admin/users/project-user-invite.component';
import { ProjectUserInviteDeleteDialogComponent } from 'app/view/project/admin/users/project-user-invite-delete-dialog.component';

import { ProjectResponsibilitiesComponent } from 'app/view/project/admin/responsibilities/project-responsibilities.component';
import { ProjectResponsibilityUpdateComponent } from 'app/view/project/admin/responsibilities/project-responsibility-update.component';
import { ProjectResponsibilityDeleteDialogComponent } from 'app/view/project/admin/responsibilities/project-responsibility-delete-dialog.component';

import { ProjectConfirmationDialogComponent } from 'app/view/project/admin/project-confirmation-dialog.component';

import { PROJECT_ADMIN_ROUTES } from './project-admin.routes';

@NgModule({
  imports: [SharedModule, DxAutocompleteModule, DxColorBoxModule, DxDateBoxModule, RouterModule.forChild(PROJECT_ADMIN_ROUTES)],
  declarations: [
    ProjectAdminComponent,
    ProjectAdminUpdateModalComponent,
    ProjectAdminUpdateComponent,
    ProjectAdminNavbarComponent,
    ProjectEventsHistoryComponent,
    ProjectLocationsComponent,
    ProjectLocationUpdateComponent,
    ProjectLocationModalComponent,
    ProjectLocationDeleteDialogComponent,
    ProjectSectionUpdateComponent,
    ProjectSectionModalComponent,
    ProjectSectionDeleteDialogComponent,
    ProjectUserInviteDeleteDialogComponent,
    ProjectUsersComponent,
    ProjectUserInviteComponent,
    ProjectResponsibilitiesComponent,
    ProjectResponsibilityUpdateComponent,
    ProjectResponsibilityDeleteDialogComponent,
    ProjectConfirmationDialogComponent,
  ],
  entryComponents: [ProjectAdminComponent],
})
export class EventPlannerProjectAdminModule {}
