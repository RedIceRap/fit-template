import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  keycloakIsDown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  keycloakEvents$: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  getLoggedUser() {
    try {
      let userDetails =
        this.keycloakService.getKeycloakInstance().idTokenParsed;
      console.log('UserDetails', userDetails);
      console.log('UserRoles', this.keycloakService.getUserRoles());
      return userDetails;
    } catch (e) {
      console.log('getLoggedUser Exception', e);
      return undefined;
    }
  }

  login() {
    this.keycloakService.login();
  }

  logout() {
    this.keycloakService.logout();
  }

  redirectToProfile() {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }

  getUserRoles(): string[] {
    const roles = this.keycloakService.getUserRoles();
    console.log(roles);

    return roles;
  }

  getToken() {
    return this.keycloakService.getToken();
  }

  testGetRequest() {
    return this.http.get('https://httpbin.org/get');
  }
}
