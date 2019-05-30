import { Injectable } from '@angular/core';
import { Position } from '../position/position';
import { OFFENSIVE_POSITIONS, DEFENSIVE_POSITIONS, SPECIAL_TEAMS_POSITIONS} from './mock-positions';

@Injectable()
export class PositionsService {

  constructor() { }

  getOffensivePositions() {
    return OFFENSIVE_POSITIONS;
  }

  getDefensivePositions() {
    return DEFENSIVE_POSITIONS;
  }

  getSpecialTeamsPositions() {
    return SPECIAL_TEAMS_POSITIONS;
  }

  clonePosition(position: Position, newId: number): Position {
    return { id: newId, name: position.name, abbreviatedName: position.abbreviatedName, side: position.side};
  }
}
