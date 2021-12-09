import { Injectable } from '@angular/core';
import {
  KeycloakEvent,
  KeycloakEventType,
  KeycloakService,
} from 'keycloak-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EUserRoles } from '../enums/user-roles.enum';
import { IKeycloakTokenParsed } from '../interfaces/keycloak-token-parsed.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSource$ = new BehaviorSubject<
    IKeycloakTokenParsed | undefined
  >(undefined);
  currentUser$: Observable<IKeycloakTokenParsed | undefined> =
    this.currentUserSource$;

  private userRolesSource$ = new BehaviorSubject<Array<EUserRoles>>([]);
  userRoles$: Observable<EUserRoles[]> = this.userRolesSource$;

  constructor(private keycloakService: KeycloakService) {
    this.keycloakEvents$().subscribe();
  }

  setCurrentUser(user: IKeycloakTokenParsed | undefined) {
    this.currentUserSource$.next(user);
  }
  getCurrentUser(): IKeycloakTokenParsed | undefined {
    return this.currentUserSource$.getValue();
  }

  setUserRoles(roles: Array<EUserRoles>) {
    this.userRolesSource$.next(roles);
  }
  getUserRoles(): Array<EUserRoles> {
    return this.userRolesSource$.getValue();
  }

  keycloakEvents$(): Observable<KeycloakEvent> {
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

  async redirectToKeycloakLogin(): Promise<void> {
    await this.keycloakService.login();
  }

  async logout(): Promise<void> {
    await this.keycloakService.logout();
  }

  clearKeycloakToken() {
    this.keycloakService.clearToken();
  }

  getKeycloakUser(): IKeycloakTokenParsed | undefined {
    return this.keycloakService.getKeycloakInstance()
      .idTokenParsed as IKeycloakTokenParsed;
  }

  getKeycloakRoles(): Array<EUserRoles> {
    return this.keycloakService.getUserRoles() as Array<EUserRoles>;
  }

  async redirectToKeycloakProfile(): Promise<void> {
    await this.keycloakService.getKeycloakInstance().accountManagement();
  }

  async getKeycloakToken(): Promise<string> {
    let token: string;

    try {
      token = await this.keycloakService.getToken();
    } catch (e) {
      token = '';
    }

    return token;
  }
}
