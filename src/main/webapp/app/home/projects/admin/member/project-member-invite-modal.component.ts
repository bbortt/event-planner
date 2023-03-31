import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { Member, ProjectMemberService } from '../../../../api';

import { MemberService } from '../../../../entities/member/service/member.service';
import { MemberFormService } from '../../../../entities/member/update/member-form.service';
import { IProject } from '../../../../entities/project/project.model';

type InviteFormType = { email: FormControl<string | null> };

@Component({
  selector: 'app-project-member-invite-modal-content',
  templateUrl: './project-member-invite-modal.component.html',
})
export class ProjectMemberInviteModalContentComponent {
  protected project: IProject | null = null;

  isSaving = false;

  protected inviteForm: FormGroup<InviteFormType>;

  constructor(
    private memberService: MemberService,
    private memberFormService: MemberFormService,
    private projectMemberService: ProjectMemberService
  ) {
    this.inviteForm = new FormGroup<InviteFormType>({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(191)],
      }),
    });
  }

  protected previousState() {
    window.history.back();
  }

  protected save() {
    if (this.project) {
      this.isSaving = true;
      this.subscribeToSaveResponse(
        this.projectMemberService.inviteMemberToProject(this.project.id!, [{ email: this.inviteForm.getRawValue().email! }], 'response')
      );
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Member>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: response => this.onSaveSuccess(response.body),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(member: Member | null): void {
    if (member) {
      this.memberService.notifyMemberUpdates({ id: member.id, invitedEmail: member.email, accepted: false, project: this.project! });
    }

    this.previousState();
  }

  protected onSaveError(): void {
    // TODO: Post a nice and readable error message
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
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
