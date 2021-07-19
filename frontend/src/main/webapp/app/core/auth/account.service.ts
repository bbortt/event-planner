import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

import { AlertService } from '../util/alert.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { SessionStorageService } from 'ngx-webstorage';
import { StateStorageService } from 'app/core/auth/state-storage.service';

import { ProjectService } from '../../entities/project/project.service';

import { Account } from 'app/core/auth/account.model';

import { Authority } from 'app/config/authority.constants';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService,
    private applicationConfigService: ApplicationConfigService,
    private projectService: ProjectService,
    private sessionStorageService: SessionStorageService,
    private stateStorageService: StateStorageService,
    private translateService: TranslateService
  ) {}

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  hasAnyRole(projectId: number, roles: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (this.hasAnyAuthority(Authority.ADMIN)) {
      return true;
    }
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    const projectRole = this.userIdentity.rolePerProject.get(`${projectId}`);
    return !!projectRole && roles.some((role: string) => projectRole === role);
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.fetch().pipe(
        catchError(() => of(null)),
        tap((account: Account | null) => {
          this.authenticate(account);

          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          // unless user have choosed other language in the current session
          if (!this.sessionStorageService.retrieve('locale') && account) {
            this.translateService.use(account.langKey);
          }

          if (account) {
            this.navigateToStoredUrl();
          }
        }),
        shareReplay()
      );
    }
    return this.accountCache$;
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  private fetch(): Observable<Account> {
    return forkJoin({
      account: this.http.get<Account>(this.applicationConfigService.getEndpointFor('api/account')),
      rolePerProject: this.projectService.getRolePerProject().pipe(
        catchError(() => {
          this.alertService.addAlert({
            type: 'danger',
            message: 'The project permissions could not be loaded. Please try again later!',
            translationKey: 'global.messages.error.fetchRolesFailed',
          });
          return of(new Map());
        })
      ),
    }).pipe(
      map(({ account, rolePerProject }: { account: Account; rolePerProject: Map<number, string> }) => {
        account.rolePerProject = new Map(Object.entries(rolePerProject));
        return account;
      })
    );
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
