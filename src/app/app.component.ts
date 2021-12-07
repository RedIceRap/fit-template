import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, of, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = 'fit-template';
  destroy$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.authService.setCurrentUser();
    from(this.authService.getToken())
      .pipe(
        tap(console.log),
        catchError(() => {
          console.log('Something went wrong');
          return of(null);
        }),

        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGetToken(): Promise<string> {
    return this.authService.getToken();
  }

  onClearToken() {
    this.authService.clearToken();
  }

  onLogin(): void {
    this.authService.login();
  }

  onTestGetRequest() {
    this.authService
      .testGetRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe(console.log);
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }

  onSetCurrentUser() {
    this.authService.setCurrentUser();
  }

  onGetRoles(): void {
    this.authService.getUserRoles();
  }

  onGetLoggedUser(): void {
    console.log(this.authService.currentUser);
  }
}
