import { Component } from '@angular/core';

import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCheck, faMapMarkerAlt, faUserAlt } from '@fortawesome/free-solid-svg-icons';

interface ILink {
  label: string;
  labelKey: string;
  icon: IconDefinition;
  routerLink: string;
}

@Component({
  selector: 'app-project-navbar',
  templateUrl: './project-navbar.component.html',
  styleUrls: ['project-navbar.component.scss'],
})
export class ProjectNavbarComponent {
  public navLinks: ILink[] = [
    {
      label: 'Locations',
      labelKey: 'eventPlannerApp.project.admin.navbar.locations',
      icon: faMapMarkerAlt,
      routerLink: 'locations',
    },
    {
      label: 'Users',
      labelKey: 'eventPlannerApp.project.admin.navbar.users',
      icon: faUserAlt,
      routerLink: 'users',
    },
    {
      label: 'Responsibilities',
      labelKey: 'eventPlannerApp.project.admin.navbar.responsibilities',
      icon: faCheck,
      routerLink: 'responsibilities',
    },
  ];
}
