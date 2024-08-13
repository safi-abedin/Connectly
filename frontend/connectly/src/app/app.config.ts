import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from "ngx-toastr";
import { provideAnimations } from "@angular/platform-browser/animations";
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      maxOpened: 1,
      autoDismiss: true,
      preventDuplicates: true,
      includeTitleDuplicates: true,
      newestOnTop: true,
      progressBar: true,
      timeOut: 3500,
      closeButton: true,
      resetTimeoutOnDuplicate: true,
      positionClass: "toast-bottom-right"
    })
  ]
};


