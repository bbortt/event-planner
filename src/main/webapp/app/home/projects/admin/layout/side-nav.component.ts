import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import { IProject } from '../../../../entities/project/project.model';
import { TranslateService } from '@ngx-translate/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-project-admin-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnDestroy, OnInit {
  @Input() project: IProject | null = null;

  protected faLocationDot = faLocationDot;
  protected isNavbarCollapsed = true;

  private routerSubscription: Subscription | null = null;

  constructor(private router: Router, private titleService: Title, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe(navigationEnd => this.updateTitleBasedOnUrl((navigationEnd as NavigationEnd).url));

    this.updateTitleBasedOnUrl(this.router.url);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  private updateTitleBasedOnUrl(url: string): void {
    if (url.endsWith('/admin/settings')) {
      this.updateTitleWithTranslation('global.menu.account.settings');
    } else if (url.endsWith('/admin/members')) {
      this.updateTitleWithTranslation('app.member.home.title');
    }
  }

  private updateTitleWithTranslation(key: string): void {
    this.translateService.get(key).subscribe(translation => this.titleService.setTitle(`${translation}: ${this.project?.name}`));
  }
}
