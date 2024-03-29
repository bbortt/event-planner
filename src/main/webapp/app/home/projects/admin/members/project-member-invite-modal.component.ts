import { Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { GetProjectMembers200Response, ProjectMemberService } from 'app/api';

import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { IProject } from 'app/entities/project/project.model';
import { MemberService } from 'app/entities/member/service/member.service';

import SharedModule from 'app/shared/shared.module';

type InviteFormType = { email: FormControl<string | null> };

@Component({
  standalone: true,
  selector: 'app-project-member-invite-modal-content',
  templateUrl: './project-member-invite-modal.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProjectMemberInviteModalContentComponent {
  isSaving = false;

  protected project: IProject | null = null;

  protected inviteForm: FormGroup<InviteFormType>;

  constructor(
    private eventManager: EventManager,
    private location: Location,
    private memberService: MemberService,
    private projectMemberService: ProjectMemberService,
  ) {
    this.inviteForm = new FormGroup<InviteFormType>({
      email: new FormControl(null, {
        validators: [Validators.email, Validators.required, Validators.minLength(1), Validators.maxLength(191)],
      }),
    });
  }

  protected previousState(): void {
    this.location.back();
  }

  protected save(): void {
    if (this.project) {
      this.isSaving = true;
      this.subscribeToSaveResponse(
        this.projectMemberService.inviteMemberToProject(this.project.id, [{ email: this.inviteForm.getRawValue().email! }], 'response'),
      );
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<GetProjectMembers200Response>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: response => this.onSaveSuccess(response.body),
      error: response => this.onSaveError(response),
    });
  }

  protected onSaveSuccess(members: GetProjectMembers200Response | null): void {
    if (members) {
      members.contents?.forEach(member =>
        this.memberService.notifyMemberUpdates({ id: member.id, invitedEmail: member.email, accepted: false, project: this.project! }),
      );
    }

    this.previousState();
  }

  protected onSaveError(httpErrorResponse: HttpErrorResponse): void {
    this.eventManager.broadcast(new EventWithContent('app.httpError', httpErrorResponse));
    this.previousState();
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}

@Component({
  standalone: true,
  selector: 'app-project-member-invite-modal',
  template: '',
  imports: [ProjectMemberInviteModalContentComponent],
})
export default class ProjectMemberInviteModalComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.modalRef = this.modalService.open(ProjectMemberInviteModalContentComponent, { size: 'lg' });
    this.modalRef.result.catch(() => this.location.back());

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
