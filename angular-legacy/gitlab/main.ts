import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { GitlabModule } from './app/gitlab.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(GitlabModule);
