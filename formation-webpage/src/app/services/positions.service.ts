import { Injectable } from '@angular/core';
import { OFFENSIVE_POSITIONS, DEFENSIVE_POSITIONS, SPECIAL_TEAMS_POSITIONS} from './mock-positions';
import { Position } from '../position/position';

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

  getPositionLocationOnField(position: Position): [number, number] {

    return [0, 0];
  }
}
