import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-mat-toolbar',
  templateUrl: './mat-toolbar.component.html',
  styleUrls: ['./mat-toolbar.component.scss'],
})
export class MatToolbarComponent implements OnInit {
  constructor(
    private coreService: CoreService,
    public authService: AuthService
  ) {}

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
