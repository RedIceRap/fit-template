import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModules, SharedComponents } from './exports';
@NgModule({
  declarations: [...SharedComponents],
  imports: [],
  exports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    ...AngularMaterialModules,
    ...SharedComponents,
  ],
})
export class SharedModule {}
