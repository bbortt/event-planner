import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectComponent } from './list/project.component';
import { ProjectDetailComponent } from './detail/project-detail.component';
import { ProjectUpdateComponent } from './update/project-update.component';
import { ProjectDeleteDialogComponent } from './delete/project-delete-dialog.component';
import { ProjectRoutingModule } from './route/project-routing.module';

@NgModule({
  imports: [SharedModule, ProjectRoutingModule],
  declarations: [ProjectComponent, ProjectDetailComponent, ProjectUpdateComponent, ProjectDeleteDialogComponent],
})
export class ProjectModule {}
