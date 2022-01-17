import { KeycloakTokenParsed } from 'keycloak-js';

export interface IKeycloakTokenParsed extends KeycloakTokenParsed {
  preferred_username?: string;
  acr?: string;
  at_hash?: string;
  aud?: string;
  auth_time?: number;
  azp?: string;
  email?: string;
  email_verified?: boolean;
  family_name?: string;
  given_name?: string;
  iss?: URL;
  jti?: string;
  name?: string;
  typ?: string;
}
