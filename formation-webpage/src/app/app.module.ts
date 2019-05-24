import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';

import { PositionsService } from './services/positions.service';
import { DisplaypositionComponent } from './position/displayposition/displayposition.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplaypositionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  entryComponents: [
    DisplaypositionComponent
  ],
  providers: [PositionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
