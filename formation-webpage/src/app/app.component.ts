import { Component } from '@angular/core';
import { PositionsService } from './services/positions.service'; 
import { MatListItem } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  positionButtonToggle = '>';
  detailButtonToggle = '<';
  detailBarOpen = true;
  version = '0.0.1';

  constructor(private positionService: PositionsService){
    this.positionService = positionService;
  }

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

  getOffensivePlayers() {
    return this.positionService.getOffensivePositions();
  }

  getDefensivePlayers() {
    return this.positionService.getDefensivePositions();
  }

  getSpecialTeamsPlayers() {
    return this.positionService.getSpecialTeamsPositions();
  }

  handlePositionClick(position: MatListItem) {
    console.log(position);
  }
}
