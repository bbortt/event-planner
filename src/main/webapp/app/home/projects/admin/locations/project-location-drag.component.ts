import { Component, Input } from '@angular/core';

import { Location } from 'app/api';

@Component({
  selector: 'app-project-location-drag',
  templateUrl: './project-location-drag.component.html',
})
export class ProjectLocationDragComponent {
  @Input() location: Location | null = null;
}
