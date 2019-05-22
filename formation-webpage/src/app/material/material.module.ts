import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatSidenavModule,
  MatExpansionModule,
  MatTabsModule,
  MatCardModule,
  MatListModule,
} from '@angular/material';

const MaterialModules = [
  MatSidenavModule,
  MatExpansionModule,
  MatTabsModule,
  MatCardModule,
  MatListModule,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    MaterialModules
  ],
})
export class MaterialModule { }
