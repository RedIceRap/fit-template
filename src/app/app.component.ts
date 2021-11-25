import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { exhaustMap, mergeMap, takeUntil } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'fit-template';
  destroy$: Subject<void> = new Subject<void>();
  onTestGetRequest$: Subject<void> = new Subject<void>();
  onGetToken$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.onTestGetRequest$
      .pipe(
        exhaustMap(() => this.authService.testGetRequest()),
        takeUntil(this.destroy$)
      )
      .subscribe(console.log, console.error, () => 'testGetRequest complete!');

    this.onGetToken$
      .pipe(
        mergeMap(() => this.authService.getToken()),
        takeUntil(this.destroy$)
      )
      .subscribe(console.log, console.error, () => 'getToken complete!');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogin() {
    this.authService.login();
  }

  onLogout() {
    this.authService.logout();
  }

  onGetRoles() {
    this.authService.getUserRoles();
  }

  onGetLoggedUser() {
    this.authService.getLoggedUser();
  }
}
