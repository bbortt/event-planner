import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest } from 'rxjs';

import { Project } from 'app/api';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

import SharedModule from 'app/shared/shared.module';

import ProjectInvitationAcceptComponent from './project-invitation-accept.component';
import ProjectInvitationLoginComponent from './project-invitation-login.component';

@Component({
  standalone: true,
  selector: 'app-project-invitation',
  templateUrl: './project-invitation.component.html',
  imports: [SharedModule, ProjectInvitationAcceptComponent, ProjectInvitationLoginComponent],
})
export default class ProjectInvitationComponent implements OnInit {
  account: Account | null = null;
  project: Project | null = null;
  invitationEmail: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.accountService.identity(), this.activatedRoute.data, this.activatedRoute.queryParams]).subscribe(
      ([account, { project }, { email }]) => {
        this.account = account;
        this.project = project;
        this.invitationEmail = email;
      },
    );
  }
}
