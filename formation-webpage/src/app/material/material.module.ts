import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';


import {
  MatSidenavModule,
  MatExpansionModule,
  MatTabsModule,
  MatCardModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatOptionModule,
  MatSelectModule,
  MatInputModule,
} from '@angular/material';

const MaterialModules = [
  MatSidenavModule,
  MatExpansionModule,
  MatTabsModule,
  MatCardModule,
  MatListModule,
  DragDropModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatOptionModule,
  MatSelectModule,
  MatInputModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModules
  ],
  exports: [
    MaterialModules
  ],
})
export class MaterialModule { }
