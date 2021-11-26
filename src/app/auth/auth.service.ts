import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { BehaviorSubject, Subscriber, Subscription } from 'rxjs';

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
  ) {
    // TODO: thats probably not the correct way
    if (!(this.keycloakEvents$ instanceof Subscriber)) {
      this.keycloakEvents$ = this.keycloakService.keycloakEvents$.subscribe({
        next: (event) => {
          if (event.type == KeycloakEventType.OnAuthError) {
            console.log(event);
          }
          if (event.type == KeycloakEventType.OnAuthLogout) {
            console.log(event);
          }
          if (event.type == KeycloakEventType.OnAuthRefreshError) {
            console.log(event);
          }
          if (event.type == KeycloakEventType.OnAuthRefreshSuccess) {
            console.log(event);
          }
          if (event.type == KeycloakEventType.OnReady) {
            console.log(event);
          }
          if (event.type == KeycloakEventType.OnTokenExpired) {
            this.keycloakService.updateToken(20);
          }
        },
      });
    }
  }

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
