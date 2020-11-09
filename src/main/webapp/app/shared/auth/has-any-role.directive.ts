import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the roles passed as the `expression`. It allows passing an "else" HTML
 * element which shall be rendered if the condition evaluation fails. By default
 * nothing will be rendered.
 *
 * @howToUse
 * ```
 *     <some-element *appHasAnyRole="{ projectId: project.id, roles: 'ADMIN'}">...</some-element>
 *
 *     <some-element *appHasAnyRole="{ projectId: project.id, roles: ['ADMIN', 'SECRETARY']};">...</some-element>
 *
 *     <some-element *appHasAnyRole="{ projectId: project.id, roles: }; else readOnlyProjectCard">...</some-element>
 *     <ng-template #readOnlyProjectCard>...</ng-template>
 * ```
 */
@Directive({
  selector: '[appHasAnyRole]',
})
export class HasAnyRoleDirective implements OnInit, OnDestroy {
  private projectId?: number;
  private roles: string[] = [];
  private elseTemplateRef?: TemplateRef<any>;

  private destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {}

  @Input()
  set appHasAnyRole(hasAnyRole: { projectId: number; roles: string | string[] }) {
    this.projectId = hasAnyRole.projectId;
    this.roles = typeof hasAnyRole.roles === 'string' ? [hasAnyRole.roles] : hasAnyRole.roles;
  }

  @Input()
  set appHasAnyRoleElse(elseTemplateRef: TemplateRef<any>) {
    this.elseTemplateRef = elseTemplateRef;
  }

  ngOnInit(): void {
    this.updateView();

    // Get notified each time authentication state changes.
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateView());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private updateView(): void {
    const hasAnyRoleInProject = this.accountService.hasAnyRole(this.projectId!, this.roles);
    this.viewContainerRef.clear();

    if (hasAnyRoleInProject) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else if (this.elseTemplateRef) {
      this.viewContainerRef.createEmbeddedView(this.elseTemplateRef);
    }
  }
}
