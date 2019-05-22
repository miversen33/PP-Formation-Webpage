import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  positionButtonToggle = '<';
  detailButtonToggle = '>';
  detailBarOpen = true;
  version = '0.0.1';

  onPositionBarClose(): void {
    this.positionButtonToggle = '>';
  }

  onPositionBarOpen(): void {
      this.positionButtonToggle = '<';
  }

  onDetailBarClose(): void {
    this.detailButtonToggle = '<';
  }

  onDetailBarOpen(): void {
      this.detailButtonToggle = '>';
  }
}
