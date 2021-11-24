import { Component } from '@angular/core';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fit-template';

  constructor(
    private keycloakService: KeycloakService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.keycloakService.keycloakEvents$.subscribe({
      next: (e) => {
        console.log(e);
        if (e.type == KeycloakEventType.OnTokenExpired) {
          this.keycloakService.updateToken(20);
        }
      },
    });
  }

  onLogin() {
    this.authService.login();
  }
  onLogout() {
    this.authService.logout();
  }

  onGetRoles() {
    this.authService.getRoles();
  }
  onGetLoggedUser() {
    this.authService.getLoggedUser();
  }
}
