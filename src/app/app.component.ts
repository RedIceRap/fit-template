import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  KeycloakEvent,
  KeycloakEventType,
  KeycloakService,
} from 'keycloak-angular';
import { Subject } from 'rxjs';
import { exhaustMap, mergeMap, takeUntil } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = 'fit-template';
  destroy$: Subject<void> = new Subject<void>();
  onTestGetRequest$: Subject<void> = new Subject<void>();
  onGetToken$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.startKeycloakEventsSub();
    this.startGetTokenSub();
    this.startTestGetRequestSub();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startKeycloakEventsSub(): void {
    this.keycloakService.keycloakEvents$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event: KeycloakEvent) => {
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

  startGetTokenSub(): void {
    this.onGetToken$
      .pipe(
        mergeMap(() => this.authService.getToken()),
        takeUntil(this.destroy$)
      )
      .subscribe(console.log, console.error, () => 'getToken complete!');
  }

  startTestGetRequestSub(): void {
    this.onTestGetRequest$
      .pipe(
        exhaustMap(() => this.authService.testGetRequest()),
        takeUntil(this.destroy$)
      )
      .subscribe(console.log, console.error, () => 'testGetRequest complete!');
  }

  onLogin(): void {
    this.authService.login();
  }

  onLogout(): void {
    this.authService.logout();
  }

  onGetRoles(): void {
    this.authService.getUserRoles();
  }

  onGetLoggedUser(): void {
    this.authService.getLoggedUser();
  }
}
