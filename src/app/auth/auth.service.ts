import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  KeycloakEvent,
  KeycloakEventType,
  KeycloakService,
} from 'keycloak-angular';
import { KeycloakTokenParsed } from 'keycloak-js';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSource$: BehaviorSubject<KeycloakTokenParsed | undefined> =
    new BehaviorSubject<KeycloakTokenParsed | undefined>(this.getCurrentUser());
  currentUser$ = this.currentUserSource$.asObservable();
  set currentUser(user: KeycloakTokenParsed | undefined) {
    this.currentUserSource$.next(this.getCurrentUser());
  }
  get currentUser(): KeycloakTokenParsed | undefined {
    return this.getCurrentUser();
  }

  keycloakEventsSub$: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {
    this.startKeycloakEventsSub();
  }

  startKeycloakEventsSub(): void {
    this.keycloakEventsSub$.unsubscribe();
    this.keycloakEventsSub$ = this.keycloakService.keycloakEvents$.subscribe({
      next: (event: KeycloakEvent) => {
        // if (event.type == KeycloakEventType.OnAuthError) {
        //   this.setCurrentUser();
        // }
        // if (event.type == KeycloakEventType.OnAuthLogout) {
        //   this.setCurrentUser();
        // }
        // if (event.type == KeycloakEventType.OnAuthRefreshError) {
        //   this.setCurrentUser();
        // }
        // if (event.type == KeycloakEventType.OnAuthRefreshSuccess) {
        //   this.setCurrentUser();
        // }
        // if (event.type == KeycloakEventType.OnReady) {
        //   this.setCurrentUser();
        // }
        if (event.type == KeycloakEventType.OnTokenExpired) {
          this.keycloakService.updateToken(20);
          // this.setCurrentUser();
        }

        this.setCurrentUser();
      },
    });
  }

  login(): void {
    this.keycloakService.login();
  }

  async logout(): Promise<void> {
    await this.keycloakService.logout();
  }

  clearToken(): void {
    this.keycloakService.clearToken();
  }

  setCurrentUser(): void {
    this.currentUser = this.getCurrentUser();
  }

  getCurrentUser() {
    return this.keycloakService.getKeycloakInstance().idTokenParsed;
  }

  redirectToProfile(): void {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }

  getUserRoles(): string[] {
    const roles = this.keycloakService.getUserRoles();
    console.log(roles);
    return roles;
  }

  async getToken(): Promise<string> {
    const token = await this.keycloakService?.getToken();
    console.log(token);
    return token;
  }

  testGetRequest(): Observable<any> {
    return this.http.get('https://httpbin.org/get').pipe(take(1));
  }
}
