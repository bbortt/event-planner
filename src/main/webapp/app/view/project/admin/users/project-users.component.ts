import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { combineLatest, Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { JhiEventManager } from 'ng-jhipster';

import { InvitationService } from 'app/entities/invitation/invitation.service';

import { Invitation } from 'app/shared/model/invitation.model';
import { Project } from 'app/shared/model/project.model';

import { ProjectUserInviteDeleteDialogComponent } from 'app/view/project/admin/users/project-user-invite-delete-dialog.component';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ADMIN } from 'app/shared/constants/role.constants';

@Component({
  selector: 'app-project-users',
  templateUrl: './project-users.component.html',
  styleUrls: ['project-users.component.scss'],
})
export class ProjectUsersComponent implements OnDestroy {
  projectId?: number;
  invitations?: Invitation[];
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;

  private loadedInvitations?: Invitation[];
  private sortOrder: 'asc' | 'desc' = 'asc';
  private sortBy = 'id';

  private eventSubscriber?: Subscription;

  roleProjectAdmin = ADMIN;

  constructor(
    private invitationService: InvitationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventManager: JhiEventManager,
    private modalService: NgbModal
  ) {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      this.projectId = (data.project as Project).id;
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      if (pageNumber !== this.page) {
        this.loadPage(pageNumber, false);
        this.registerChangeInInvitations();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  public loadPage(page?: number, navigate = true): void {
    const pageToLoad = page || this.page || 1;

    this.invitationService
      .findAllByProjectId(this.projectId!, {
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<Invitation[]>) => this.onSuccess(res.body, res.headers, pageToLoad, navigate));
  }

  private onSuccess(data: Invitation[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/project', this.projectId, 'admin', 'users'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sortBy + ',' + this.sortOrder,
        },
      });
    }
    this.loadedInvitations = data || [];
    this.invitations = this.loadedInvitations;
  }

  private sort(): string[] {
    const result = [this.sortBy + ',' + this.sortOrder];
    if (this.sortBy !== 'id') {
      result.push('id');
    }
    return result;
  }

  filterData(searchString: string): void {
    this.invitations = this.loadedInvitations!.filter((invitation: Invitation) =>
      invitation.email.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  registerChangeInInvitations(): void {
    this.eventSubscriber = this.eventManager.subscribe('invitationListModification', () => this.loadPage());
  }

  trackByFn(index: number, item: Invitation): number {
    return item.id!;
  }

  delete(invitation: Invitation): void {
    const modalRef = this.modalService.open(ProjectUserInviteDeleteDialogComponent, { backdrop: 'static' });
    modalRef.componentInstance.invitation = invitation;
  }
}
