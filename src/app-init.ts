import { KeycloakOptions, KeycloakService } from 'keycloak-angular';
import { environment } from './environments/environment';

export const initializer = (keycloak: KeycloakService) => {
  const options: KeycloakOptions = {
    config: environment.keycloakConfig,
  };
  return (): Promise<any> => keycloak.init(options);
};
