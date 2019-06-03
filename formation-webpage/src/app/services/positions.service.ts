import { Injectable } from '@angular/core';
import { Position } from '../position/position';
import { OFFENSIVE_POSITIONS, DEFENSIVE_POSITIONS, SPECIAL_TEAMS_POSITIONS} from './mock-positions';

@Injectable()
export class PositionsService {

  constructor() { }

  getOffensivePositions(): Position[] {
    return OFFENSIVE_POSITIONS;
  }

  getDefensivePositions(): Position[] {
    return DEFENSIVE_POSITIONS;
  }

  getSpecialTeamsPositions(): Position[] {
    return SPECIAL_TEAMS_POSITIONS;
  }

  getPositions(): Position[] {
    return this.getOffensivePositions().concat(this.getDefensivePositions(), this.getSpecialTeamsPositions());
  }

  clonePosition(position: Position, newId: number): Position {
    return { id: newId, name: position.name, abbreviatedName: position.abbreviatedName, side: position.side};
  }
}
