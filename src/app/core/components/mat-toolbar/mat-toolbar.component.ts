import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { IKeycloakTokenParsed } from 'src/app/auth/interfaces/keycloak-token-parsed.interface';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { CoreService } from '../../services/core/core.service';

@Component({
  selector: 'app-mat-toolbar',
  templateUrl: './mat-toolbar.component.html',
  styleUrls: ['./mat-toolbar.component.scss'],
})
export class MatToolbarComponent implements OnInit {
  currentUser$: Observable<IKeycloakTokenParsed | undefined>;

  constructor(
    private coreService: CoreService,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$.pipe(shareReplay());
  }

  ngOnInit() {}

  onToggleDrawer() {
    this.coreService.toggleDrawerState();
  }

  onLogin() {
    this.authService.redirectToKeycloakLogin();
  }

  onLogout() {
    this.authService.logout();
  }
}
