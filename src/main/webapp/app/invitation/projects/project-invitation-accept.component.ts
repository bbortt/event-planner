import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { from, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { Member, Project, ProjectMemberService } from 'app/api';

import { Account } from 'app/core/auth/account.model';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { EntityResponseType, MemberService } from 'app/entities/member/service/member.service';
import { IProject } from 'app/entities/project/project.model';

import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-project-invitation-accept',
  templateUrl: './project-invitation-accept.component.html',
  imports: [SharedModule],
})
export default class ProjectInvitationAcceptComponent implements OnInit {
  @Input() account: Account | null = null;
  @Input() project: Project | null = null;
  @Input() email: string | null = null;

  isLoading = true;
  isSaving = false;

  member: Member | null = null;

  constructor(
    private alertService: AlertService,
    private eventManager: EventManager,
    private memberService: MemberService,
    private projectMemberService: ProjectMemberService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.email) {
      this.email = this.account?.email ?? null;
    }

    if (this.project && this.email) {
      this.projectMemberService
        .findProjectMemberByTokenAndEmail(this.project.id!, this.email, 'response')
        .pipe(
          finalize(() => (this.isLoading = false)),
          tap(member => {
            if (member.body?.accepted) {
              this.onAccepted();
            }
          }),
        )
        .subscribe({
          next: (response: HttpResponse<Member>) => {
            this.member = response.body;
          },
          error: (response: HttpErrorResponse) => {
            if (response.status !== 404) {
              this.onAcceptFailed(response);
            }
          },
        });
    }
  }

  acceptInvitation(): void {
    this.isSaving = true;
    if (this.member) {
      this.subscribeToAcceptResponse(this.memberService.partialUpdate({ id: this.member.id, accepted: true }));
    } else {
      this.subscribeToAcceptResponse(
        this.memberService.create({
          id: null,
          invitedEmail: this.email,
          accepted: true,
          acceptedBy: this.email,
          acceptedDate: dayjs(),
          project: this.getProject(),
        }),
      );
    }
  }

  private getProject(): IProject | null {
    if (!this.project) {
      return null;
    }

    return {
      id: this.project.id!,
    };
  }

  private subscribeToAcceptResponse(result: Observable<EntityResponseType>): void {
    result.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.onAccepted(),
      error: response => this.onAcceptFailed(response),
    });
  }

  private onAccepted(): void {
    from(this.router.navigateByUrl('/')).subscribe(() =>
      this.alertService.addAlert({
        type: 'success',
        translationKey: 'app.project.invitation.accepting.success',
        translationParams: { projectName: this.project?.name },
      }),
    );
  }

  private onAcceptFailed(httpErrorResponse: HttpErrorResponse): void {
    this.eventManager.broadcast(new EventWithContent('app.httpError', httpErrorResponse));
  }
}
