import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from '../interceptors/auth-interceptor';
import { Observable, first } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { GlobalErrorHandler } from '../error-handlers/global-error-handler';
import { provideAnimations } from '@angular/platform-browser/animations'; // Add this import
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

function initializeAuth(authService: AuthService) {
    // Used to avoid initial flicker
    return (): Observable<any> => {
        return authService.loadCurrentUser().pipe(first());
    };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeAuth,
            deps: [AuthService],
            multi: true,
        },
        provideAnimationsAsync(),
        providePrimeNG({}),
    ],
};
