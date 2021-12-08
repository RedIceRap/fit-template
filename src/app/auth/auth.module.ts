import { APP_INITIALIZER, NgModule } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { of } from 'rxjs';
import * as keycloakConfig from 'src/assets/keycloak.config.json';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './services/auth/auth.service';

const initializeKeycloak = (keycloak: KeycloakService) => {
  const { realm, url, clientId } = keycloakConfig;
  return (): Promise<boolean> =>
    keycloak
      .init({
        config: {
          realm,
          url,
          clientId,
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            // window.location.href.endsWith('/')  ? '' :
            window.location.origin + '/assets/silent-check-sso.html',
          checkLoginIframe: false,
        },
        enableBearerInterceptor: true,
        bearerPrefix: 'Bearer',
        bearerExcludedUrls: ['/assets', '/clients/public'],
      })
      .catch((e) => {
        console.error(e);
        return of(false).toPromise();
      });
};

@NgModule({
  declarations: [],
  imports: [KeycloakAngularModule, SharedModule],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
})
export class AuthModule {}
