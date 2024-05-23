import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { APP_INITIALIZER, CSP_NONCE, ErrorHandler, Injector, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { config, dom } from '@fortawesome/fontawesome-svg-core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { authenticationFactory } from '@tec/condor/factory';
import { AddTokenOidcInterceptor } from '@tec/condor/interceptors';
import { AuthenticationService, CdErrorHandler, ConstantService } from '@tec/condor/services';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { MessageService } from 'primeng/api';
import { initApplication } from './app/app-init.function';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { FakeBackendInterceptor } from './app/helpers/fakebackend.provider';
registerLocaleData(localeFr);

// Fontawesome SVG Core
// Désactivation de l'insertion automatique de CSS pour éviter d'être bloqué par les CSP
// (https://fontawesome.com/docs/web/dig-deeper/security#content-security-policy)
config.autoAddCss = false;

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),

    // Service d'authentification (CONDOR)
    { provide: AuthenticationService, useFactory: authenticationFactory },

    // Traitements à l'initialisation de l'application
    { provide: APP_INITIALIZER, useFactory: initApplication, deps: [ConstantService, Injector, NGXLogger], multi: true },

    // Routes de l'application
    provideRouter(APP_ROUTES),

    // Configure HttpClient
    importProvidersFrom(HttpClientModule),

    // Logger
    importProvidersFrom(LoggerModule.forRoot({ level: NgxLoggerLevel.INFO })),

    // I18N
    importProvidersFrom(TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })),

    // Gestion des erreurs (CONDOR)
    { provide: ErrorHandler, useClass: CdErrorHandler },

    // Services PrimeNG
    MessageService,

    // Locale de l'application
    { provide: LOCALE_ID, useValue: 'fr-FR' },

    // Intercepteur FakeBackend
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },

    // Intercepteur OIDC (CONDOR)
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenOidcInterceptor, multi: true },
  ]
});

// ngx-translate : required for AOT compilation
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/');
}