import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PositionsService } from './services/positions.service';

import { MaterialModule } from './material/material.module';
import { DisplaypositionComponent } from './position/displayposition/displayposition.component';
import { PositionbarComponent } from './positionbar/positionbar.component';
import { DetailbarComponent } from './detailbar/detailbar.component';
import { FieldComponent } from './field/field.component';

import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    DisplaypositionComponent,
    PositionbarComponent,
    DetailbarComponent,
    FieldComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    DragDropModule
  ],
  entryComponents: [
    DisplaypositionComponent
  ],
  providers: [PositionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
