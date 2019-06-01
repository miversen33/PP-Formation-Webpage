import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { PositionsService } from '../services/positions.service';
import { Position } from '../position/position';
import { PositionSelector } from './positionSelector';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material';

@Component({
  selector: 'app-positionbar',
  templateUrl: './positionbar.component.html',
  styleUrls: ['./positionbar.component.css']
})
export class PositionbarComponent implements OnInit {

  @Output() positionSelected = new EventEmitter<PositionSelector>();
  @Output() positionReleased = new EventEmitter();

  @ViewChild('offensePanel') offensePanel: MatExpansionPanel;
  @ViewChild('defensePanel') defensePanel: MatExpansionPanel;
  @ViewChild('specialTeamsPanel') specialTeamsPanel: MatExpansionPanel;

  constructor(private positionService: PositionsService) { }

  ngOnInit() {}

  closeAll(): void {
    this.offensePanel.close();
    this.defensePanel.close();
    this.specialTeamsPanel.close();
  }

  getOffensivePlayers(): Position[] {
    return this.positionService.getOffensivePositions();
  }

  getDefensivePlayers(): Position[] {
    return this.positionService.getDefensivePositions();
  }

  getSpecialTeamsPlayers(): Position[] {
    return this.positionService.getSpecialTeamsPositions();
  }

  onMouseDown(mouseEvent: MouseEvent, p: Position): void {
    this.positionSelected.emit({x: mouseEvent.clientX, y: mouseEvent.clientY, position: p});
  }

  onMouseUp(): void {
    this.positionReleased.emit();
  }

}
