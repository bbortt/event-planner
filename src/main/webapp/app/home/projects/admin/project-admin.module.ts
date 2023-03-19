import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { PROJECT_ADMIN_ROUTES } from './project-admin.route';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { ProjectEntityModule } from '../../../entities/project/project-entity.module';

@NgModule({
  imports: [SharedModule, ProjectEntityModule, RouterModule.forChild(PROJECT_ADMIN_ROUTES)],
  declarations: [AdminLayoutComponent],
})
export class ProjectAdminModule {}
