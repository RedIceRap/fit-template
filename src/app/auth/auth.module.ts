import { APP_INITIALIZER, NgModule } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthService } from './services/auth.service';

const initializeKeycloak = (
  keycloak: KeycloakService,
  authService: AuthService
) => {
  return async (): Promise<boolean> => {
    const config = await authService.getKeycloakConfig().toPromise();

    const authenticated = await keycloak.init({
      config,
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false,
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets', '/clients/public'],
    });

    if (authenticated) {
      authService.setCurrentUser(authService.getKeycloakUser());
    }

    return authenticated;
  };
};

@NgModule({
  declarations: [],
  imports: [KeycloakAngularModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, AuthService],
    },
  ],
})
export class AuthModule {}
