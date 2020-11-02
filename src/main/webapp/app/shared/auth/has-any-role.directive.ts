import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the roles passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *jhiHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *jhiHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  selector: '[appHasAnyRole]',
})
export class HasAnyRoleDirective implements OnDestroy {
  private projectId?: number;
  private roles: string[] = [];
  private authenticationSubscription?: Subscription;

  constructor(private accountService: AccountService, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {}

  @Input()
  set appHasAnyRole(hasAnyRole: { projectId: number; roles: string | string[] }) {
    this.projectId = hasAnyRole.projectId;
    this.roles = typeof hasAnyRole.roles === 'string' ? [hasAnyRole.roles] : hasAnyRole.roles;
    this.updateView();
    // Get notified each time authentication state changes.
    this.authenticationSubscription = this.accountService.getAuthenticationState().subscribe(() => this.updateView());
  }

  ngOnDestroy(): void {
    if (this.authenticationSubscription) {
      this.authenticationSubscription.unsubscribe();
    }
  }

  private updateView(): void {
    const hasAnyRoleInProject = this.accountService.hasAnyRole(this.projectId!, this.roles);
    this.viewContainerRef.clear();
    if (hasAnyRoleInProject) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
