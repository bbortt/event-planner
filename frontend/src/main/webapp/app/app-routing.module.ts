import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';

import { DEBUG_INFO_ENABLED } from 'app/app.constants';

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
  imports: [RouterModule.forRoot(LAYOUT_ROUTES, { preloadingStrategy: PreloadAllModules, enableTracing: DEBUG_INFO_ENABLED })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
