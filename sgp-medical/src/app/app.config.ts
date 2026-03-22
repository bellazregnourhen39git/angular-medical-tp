import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptorFn } from './core/interceptors/auth.interceptor';
import { auditInterceptorFn } from './core/interceptors/audit.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // HttpClient avec intercepteurs fonctionnels (Angular 17+)
    provideHttpClient(
      withInterceptors([authInterceptorFn, auditInterceptorFn])
    ),
  ]
};
