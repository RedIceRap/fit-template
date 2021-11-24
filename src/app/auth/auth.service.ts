import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private config: any;

  constructor(private keycloak: KeycloakService) {}

  getLoggedUser() {
    try {
      let userDetails = this.keycloak.getKeycloakInstance().idTokenParsed;
      console.log('UserDetails', userDetails);
      console.log('UserRoles', this.keycloak.getUserRoles());
      return userDetails;
    } catch (e) {
      console.log('getLoggedUser Exception', e);
      return undefined;
    }
  }

  logout() {
    this.keycloak.logout();
  }

  redirectToProfile() {
    this.keycloak.getKeycloakInstance().accountManagement();
  }

  getRoles(): string[] {
    return this.keycloak.getUserRoles();
  }
}
