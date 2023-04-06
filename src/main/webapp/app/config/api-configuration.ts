import { Injectable } from '@angular/core';

import { Configuration } from 'app/api';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable()
export class ApiConfiguration extends Configuration {
  constructor(private applicationConfigService: ApplicationConfigService) {
    super({ basePath: applicationConfigService.getEndpointFor('api/rest') });
  }
}
