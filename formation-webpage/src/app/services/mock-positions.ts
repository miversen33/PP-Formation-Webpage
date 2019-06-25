import { Position } from '../position/position';
import { Location } from '../location';

const OFFENSE = 'Offense';
const DEFENSE = 'Defense';
const SPECIAL_TEAMS = 'Special Teams';

export const OFFENSIVE_POSITIONS: Position[] = [
  { id: 1, name: 'Quarterback', abbreviatedName: 'QB', side: OFFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 2, name: 'Halfback', abbreviatedName: 'HB', side: OFFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 3, name: 'Fullback', abbreviatedName: 'FB', side: OFFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 4, name: 'Tight End', abbreviatedName: 'TE', side: OFFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 5, name: 'Tackle', abbreviatedName: 'OT', side: OFFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 6, name: 'Guard', abbreviatedName: 'G', side: OFFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 7, name: 'Center', abbreviatedName: 'C', side: OFFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 8, name: 'Wide Reciever', abbreviatedName: 'WR', side: OFFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
];

export const DEFENSIVE_POSITIONS: Position[] = [
  { id: 10, name: 'Middle Linebacker', abbreviatedName: 'MLB', side: DEFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 11, name: 'Outside Linebacker', abbreviatedName: 'OLB', side: DEFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 12, name: 'Defensive Tackle', abbreviatedName: 'DT', side: DEFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 13, name: 'Defensive End', abbreviatedName: 'DE', side: DEFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 14, name: 'Nose Guard', abbreviatedName: 'NG', side: DEFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 15, name: 'Cornerback', abbreviatedName: 'CB', side: DEFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 16, name: 'Free Safety', abbreviatedName: 'FS', side: DEFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 17, name: 'Strong Safety', abbreviatedName: 'SS', side: DEFENSE, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
];

export const SPECIAL_TEAMS_POSITIONS: Position[] = [
  { id: 20, name: 'Kicker', abbreviatedName: 'K', side: SPECIAL_TEAMS, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
  { id: 21, name: 'Punter', abbreviatedName: 'P', side: SPECIAL_TEAMS, x: 0, y: 0, displayX: 0, displayY: 0, slot: -1},
];
