import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  KeycloakEvent,
  KeycloakEventType,
  KeycloakService,
} from 'keycloak-angular';
import { KeycloakConfig } from 'keycloak-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EUserRoles } from '../enums/user-roles.enum';
import { IKeycloakTokenParsed } from '../interfaces/keycloak-token-parsed.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSource$ = new BehaviorSubject<IKeycloakTokenParsed | null>(
    null
  );
  currentUser$: Observable<IKeycloakTokenParsed | null> =
    this.currentUserSource$;

  private userRolesSource$ = new BehaviorSubject<Array<EUserRoles>>([]);
  userRoles$: Observable<EUserRoles[]> = this.userRolesSource$;

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {
    this.oKeycloakEvents$().subscribe();
  }

  setCurrentUser(user: IKeycloakTokenParsed | null) {
    this.setUserRoles(this.getKeycloakRoles());
    this.currentUserSource$.next(user);
  }
  getCurrentUser(): IKeycloakTokenParsed | null {
    return this.currentUserSource$.getValue();
  }

  setUserRoles(roles: Array<EUserRoles>) {
    this.userRolesSource$.next(roles);
  }
  getUserRoles(): Array<EUserRoles> {
    return this.userRolesSource$.getValue();
  }

  oKeycloakEvents$(): Observable<KeycloakEvent> {
    return this.keycloakService.keycloakEvents$.pipe(
      tap((event: KeycloakEvent) => {
        // if (event.type == KeycloakEventType.OnAuthError) {
        // }

        // if (event.type == KeycloakEventType.OnAuthLogout) {
        // }

        // if (event.type == KeycloakEventType.OnAuthRefreshError) {
        // }

        // if (event.type == KeycloakEventType.OnAuthRefreshSuccess) {
        // }

        // if (event.type == KeycloakEventType.OnReady) {
        // }

        if (event.type == KeycloakEventType.OnTokenExpired) {
          this.keycloakService.updateToken(20);
        }
      })
    );
  }

  getKeycloakConfig(): Observable<KeycloakConfig> {
    return this.http.get<KeycloakConfig>('/assets/keycloak.config.json');
  }

  async redirectToKeycloakLogin(): Promise<void> {
    await this.keycloakService.login();
  }

  async logout(): Promise<void> {
    await this.keycloakService.logout();
  }

  clearKeycloakToken() {
    this.keycloakService.clearToken();
  }

  getKeycloakUser(): IKeycloakTokenParsed | null {
    const user = this.keycloakService.getKeycloakInstance().idTokenParsed as
      | IKeycloakTokenParsed
      | undefined;

    if (user) {
      return user;
    } else {
      return null;
    }
  }

  getKeycloakRoles(): Array<EUserRoles> {
    const roles = this.keycloakService.getUserRoles() as Array<EUserRoles>;

    return roles;
  }

  async getKeycloakToken(): Promise<string> {
    const token = await this.keycloakService.getToken().catch((e) => '');

    return token;
  }
}
