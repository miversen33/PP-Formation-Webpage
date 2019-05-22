import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule, MatExpansionModule, MatTabsModule } from '@angular/material';

const MaterialModules = [
  MatSidenavModule,
  MatExpansionModule,
  MatTabsModule
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
