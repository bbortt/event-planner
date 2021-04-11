import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { EventManager } from 'app/core/util/event-manager.service';

import { ProjectUserInviteComponent } from 'app/view/project/admin/users/project-user-invite.component';

@Component({
  template: '',
})
export class ProjectUserInviteModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private eventManager: EventManager, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.activatedRoute.data.subscribe(({ project, invitation }) => {
      this.modalRef = this.modalService.open(ProjectUserInviteComponent, {
        beforeDismiss(): boolean {
          window.history.back();
          return true;
        },
      });

      (this.modalRef.componentInstance as ProjectUserInviteComponent).updateForm(project, invitation || {});
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
