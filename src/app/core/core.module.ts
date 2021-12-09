import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MatDrawerComponent } from './components/mat-drawer/mat-drawer.component';
import { MatToolbarComponent } from './components/mat-toolbar/mat-toolbar.component';

@NgModule({
  declarations: [MatDrawerComponent, MatToolbarComponent],
  imports: [SharedModule],
  exports: [MatDrawerComponent],
})
export class CoreModule {}
