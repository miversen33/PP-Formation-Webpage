import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatSidenavModule,
  MatExpansionModule,
  MatTabsModule,
  MatCardModule,
  MatListModule,
  MatListItem,
} from '@angular/material';

const MaterialModules = [
  MatSidenavModule,
  MatExpansionModule,
  MatTabsModule,
  MatCardModule,
  MatListModule,
  MatListItem
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
