import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  KeycloakEvent,
  KeycloakEventType,
  KeycloakService,
} from 'keycloak-angular';
import { KeycloakTokenParsed } from 'keycloak-js';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSource$: BehaviorSubject<KeycloakTokenParsed | undefined> =
    new BehaviorSubject<KeycloakTokenParsed | undefined>(this.getCurrentUser());
  currentUser$ = this.currentUserSource$.asObservable().pipe(
    map((currentUser) => {
      this.sharedService.log('authService.currentUser$');
      return currentUser;
    })
  );
  set currentUser(user: KeycloakTokenParsed | undefined) {
    this.sharedService.log('set authService.currentUser');
    this.currentUserSource$.next(this.getCurrentUser());
  }
  get currentUser(): KeycloakTokenParsed | undefined {
    this.sharedService.log('get authService.currentUser');
    return this.getCurrentUser();
  }

  keycloakEventsSub$: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService,
    private sharedService: SharedService
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
    return roles;
  }

  async getToken(): Promise<string> {
    const token = await this.keycloakService?.getToken();
    return token;
  }

  testGetRequest(): Observable<any> {
    return this.http.get('https://httpbin.org/get').pipe(take(1));
  }
}
