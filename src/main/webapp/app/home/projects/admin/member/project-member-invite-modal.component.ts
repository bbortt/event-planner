import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { Project } from '../../../../api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-member-invite-modal-content',
  templateUrl: './project-member-invite-modal.component.html',
})
export class ProjectMemberInviteModalContentComponent {
  project: Project | null = null;
}

@Component({
  selector: 'app-project-member-invite-modal',
  template: '',
})
export class ProjectMemberInviteModalComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef | undefined;

  constructor(private activatedRoute: ActivatedRoute, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.modalRef = this.modalService.open(ProjectMemberInviteModalContentComponent, { size: 'lg' });
    this.modalRef.result.catch(() => window.history.back());

    this.activatedRoute.data.subscribe(({ project }) => {
      if (this.modalRef && project) {
        this.modalRef.componentInstance.project = project;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
