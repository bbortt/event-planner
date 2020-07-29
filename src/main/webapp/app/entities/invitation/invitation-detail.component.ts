import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInvitation } from 'app/shared/model/invitation.model';

@Component({
  selector: 'jhi-invitation-detail',
  templateUrl: './invitation-detail.component.html',
})
export class InvitationDetailComponent implements OnInit {
  invitation: IInvitation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invitation }) => (this.invitation = invitation));
  }

  previousState(): void {
    window.history.back();
  }
}
