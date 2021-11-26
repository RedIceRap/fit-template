import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.authService.setCurrentUser();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onGetToken() {
    await this.authService.getToken();
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
