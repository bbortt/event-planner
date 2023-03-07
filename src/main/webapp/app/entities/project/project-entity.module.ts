import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { ProjectDeleteDialogComponent } from './delete/project-delete-dialog.component';
import { ProjectDetailComponent } from './detail/project-detail.component';
import { ProjectComponent } from './list/project.component';
import { ProjectUpdateComponent } from './update/project-update.component';

@NgModule({
  imports: [SharedModule, RouterModule],
  declarations: [ProjectComponent, ProjectDetailComponent, ProjectUpdateComponent, ProjectDeleteDialogComponent],
  exports: [ProjectUpdateComponent],
})
export class ProjectEntityModule {}
