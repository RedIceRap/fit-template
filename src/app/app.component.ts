import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string = 'fit-template';

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onLogin() {
    this.authService.redirectToKeycloakLogin();
  }

  onLogout() {
    this.authService.logout();
  }
}
