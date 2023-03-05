import { Injectable } from '@angular/core';

import { Configuration } from '../api';

import { ApplicationConfigService } from '../core/config/application-config.service';

@Injectable()
export class ApiConfiguration extends Configuration {
  constructor(private applicationConfigService: ApplicationConfigService) {
    super({ basePath: applicationConfigService.getEndpointFor('api/rest') });
  }
}
