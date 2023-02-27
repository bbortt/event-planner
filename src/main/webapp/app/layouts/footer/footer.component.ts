import { Component } from '@angular/core';

import { IconLookup } from '@fortawesome/fontawesome-common-types';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public faGithub = faGithub as IconLookup;
}
