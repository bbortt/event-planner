import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DragulaModule } from 'ng2-dragula';

import SharedModule from 'app/shared/shared.module';

import { PROJECT_ADMIN_ROUTES } from './project-admin.route';

import AdminLayoutComponent from './layout/admin-layout.component';
import SideNavComponent from './layout/side-nav.component';

@NgModule({
  imports: [DragulaModule.forRoot(), SharedModule, RouterModule.forChild(PROJECT_ADMIN_ROUTES)],
  declarations: [AdminLayoutComponent, SideNavComponent],
})
export class ProjectAdminModule {}
