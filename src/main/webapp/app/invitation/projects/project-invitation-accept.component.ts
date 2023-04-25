import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Member, Project, ProjectMemberService } from 'app/api';

import { AlertService } from 'app/core/util/alert.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { EntityResponseType, MemberService } from 'app/entities/member/service/member.service';
import { IProject } from '../../entities/project/project.model';

@Component({
  selector: 'app-project-invitation-accept',
  templateUrl: './project-invitation-accept.component.html',
})
export class ProjectInvitationAcceptComponent implements OnInit {
  @Input() project: Project | null = null;
  @Input() email: string | null = null;

  isLoading = true;
  member: Member | null = null;

  isSaving = false;

  constructor(
    private alertService: AlertService,
    private eventManager: EventManager,
    private memberService: MemberService,
    private projectMemberService: ProjectMemberService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.project && this.email) {
      this.projectMemberService
        .findProjectMemberByTokenAndEmail(this.project.id!, this.email, 'response')
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (response: HttpResponse<Member>) => {
            this.member = response.body;
          },
          error: (response: HttpErrorResponse) => this.onAcceptFailed(response),
        });
    }
  }

  acceptInvitation(): void {
    this.isSaving = true;
    if (this.member) {
      this.subscribeToAcceptResponse(this.memberService.partialUpdate({ id: this.member.id, accepted: true }));
    } else {
      this.subscribeToAcceptResponse(
        this.memberService.create({ id: null, accepted: true, invitedEmail: this.email, project: this.getProject() })
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
    result.subscribe({
      next: () => this.onAccepted(),
      error: response => this.onAcceptFailed(response),
    });
  }

  private onAccepted(): void {
    of(this.router.navigate(['/'])).subscribe(() =>
      this.alertService.addAlert({ type: 'success', translationKey: 'app.project.invitation.accepting.success' })
    );
  }

  private onAcceptFailed(httpErrorResponse: HttpErrorResponse): void {
    this.eventManager.broadcast(new EventWithContent('app.httpError', httpErrorResponse));
  }
}
