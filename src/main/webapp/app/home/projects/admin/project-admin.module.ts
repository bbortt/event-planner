import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';

import { PROJECT_ADMIN_ROUTES } from './project-admin.route';

import AdminLayoutComponent from './layout/admin-layout.component';
import SideNavComponent from './layout/side-nav.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(PROJECT_ADMIN_ROUTES)],
  declarations: [AdminLayoutComponent, SideNavComponent],
})
export class ProjectAdminModule {}
