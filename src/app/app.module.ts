import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule } from 'keycloak-angular';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, KeycloakAngularModule, AuthModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
