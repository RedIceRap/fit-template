import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SharedService } from '@app/shared/services/shared.service';
import { SharedModule } from '@shared/shared.module';
import * as keycloakConfig from 'assets/keycloak.config.json';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthService } from './services/auth.service';

const initializeKeycloak = (
  keycloak: KeycloakService,
  authService: AuthService,
  sharedService: SharedService
) => {
  const { realm, url, clientId } = keycloakConfig;

  return async (): Promise<boolean> => {
    const keycloakInit = keycloak.init({
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
    });

    const authenticated = await keycloakInit;

    if (authenticated) {
      authService.setCurrentUser(authService.getKeycloakUser());
      authService.setUserRoles(authService.getKeycloakRoles());
    } else {
      sharedService.openSnackBar({ message: 'See you soon!' });
    }

    return authenticated;
  };
};

@NgModule({
  declarations: [],
  imports: [KeycloakAngularModule, SharedModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, AuthService, SharedService],
    },
  ],
})
export class AuthModule {}
