import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { finalize } from 'rxjs/operators';

import { Member, Project, ProjectMemberService } from 'app/api';
import { MemberService } from 'app/entities/member/service/member.service';

@Component({
  selector: 'app-project-invitation-accept',
  templateUrl: './project-invitation-accept.component.html',
})
export class ProjectInvitationAcceptComponent implements OnInit {
  @Input() project: Project | null = null;
  @Input() email: string | null = null;

  isLoading = true;
  member: Member | null = null;

  constructor(private memberService: MemberService, private projectMemberService: ProjectMemberService) {}

  ngOnInit(): void {
    if (this.project && this.email) {
      this.projectMemberService
        .findProjectMemberByTokenAndEmail(this.project.id!, this.email, 'response')
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((response: HttpResponse<Member>) => {
          this.member = response.body;
        });
    }
  }

  acceptInvitation(): void {
    if (this.member) {
      this.memberService.partialUpdate({ id: this.member.id, accepted: true });
    }
  }
}
