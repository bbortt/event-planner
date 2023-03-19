import { Component, Input } from '@angular/core';

import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import { IProject } from '../../../../entities/project/project.model';

@Component({
  selector: 'app-project-admin-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  @Input() project: IProject | null = null;

  protected faLocationDot = faLocationDot;
  protected isNavbarCollapsed = true;

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
