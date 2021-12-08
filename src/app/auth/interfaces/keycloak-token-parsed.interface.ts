import { KeycloakTokenParsed } from 'keycloak-js';

export interface IKeycloakTokenParsed extends KeycloakTokenParsed {
  preferred_username: string;
}
