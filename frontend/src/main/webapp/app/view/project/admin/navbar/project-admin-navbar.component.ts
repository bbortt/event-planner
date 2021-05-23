import { Component } from '@angular/core';

import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faHistory, faCheck, faMapMarkerAlt, faUserAlt } from '@fortawesome/free-solid-svg-icons';

interface ILink {
  label: string;
  labelKey: string;
  icon: IconDefinition;
  routerLink: string;
}

@Component({
  selector: 'app-project-admin-navbar',
  templateUrl: './project-admin-navbar.component.html',
  styleUrls: ['./project-admin-navbar.component.scss'],
})
export class ProjectAdminNavbarComponent {
  navLinks: ILink[] = [
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
    {
      label: 'History',
      labelKey: 'eventPlannerApp.project.admin.navbar.eventHistory',
      icon: faHistory,
      routerLink: 'events/history',
    },
  ];
}
