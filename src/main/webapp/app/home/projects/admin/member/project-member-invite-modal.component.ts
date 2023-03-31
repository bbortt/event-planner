import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { Project, ProjectMemberService } from '../../../../api';

import { MemberFormGroup, MemberFormService } from '../../../../entities/member/update/member-form.service';

@Component({
  selector: 'app-project-member-invite-modal-content',
  templateUrl: './project-member-invite-modal.component.html',
})
export class ProjectMemberInviteModalContentComponent {
  protected project: Project | null = null;

  isSaving = false;

  protected inviteForm: MemberFormGroup;

  constructor(private memberFormService: MemberFormService, private projectMemberService: ProjectMemberService) {
    this.inviteForm = this.memberFormService.createMemberFormGroup();
  }

  protected previousState() {
    window.history.back();
  }

  protected save() {}
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
