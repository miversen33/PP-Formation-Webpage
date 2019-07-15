import { Position } from '../position/position';
// import { Location } from '../location';

const OFFENSE = 'Offense';
const DEFENSE = 'Defense';
const SPECIAL_TEAMS = 'Special Teams';

export const OFFENSIVE_POSITIONS: Position[] = [
  new Position(1, 'Quarterback', 'QB', OFFENSE),
  new Position(2, 'Halfback', 'HB', OFFENSE),
  new Position(3, 'Fullback', 'FB', OFFENSE),
  new Position(4, 'Tight End', 'TE', OFFENSE),
  new Position(5, 'Tackle', 'OT', OFFENSE),
  new Position(6, 'Guard', 'OG', OFFENSE),
  new Position(7, 'Center', 'C', OFFENSE),
  new Position(8, 'Wide Receiver', 'WR', OFFENSE),
];

export const DEFENSIVE_POSITIONS: Position[] = [
  new Position(10, 'Middle Linebacker', 'MLB', DEFENSE),
  new Position(11, 'Outside Linebacker', 'OLB', DEFENSE),
  new Position(12, 'Defensive Tackle', 'DT', DEFENSE),
  new Position(13, 'Defensive End', 'DE', DEFENSE),
  new Position(15, 'Cornerback', 'CB', DEFENSE),
  new Position(16, 'Free Safety', 'FS', DEFENSE),
  new Position(17, 'Strong Safety', 'SS', DEFENSE),
];

export const SPECIAL_TEAMS_POSITIONS: Position[] = [
  new Position(20, 'Kicker', 'K', SPECIAL_TEAMS),
  new Position(21, 'Punter', 'P', SPECIAL_TEAMS),
];
