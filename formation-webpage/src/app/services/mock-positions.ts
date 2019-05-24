import { Position } from '../position/position';

const OFFENSE = 'Offense';
const DEFENSE = 'Defense';
const SPECIAL_TEAMS = 'Special Teams';

export const OFFENSIVE_POSITIONS: Position[] = [
  { id: 1, name: 'Quarterback', abbreviatedName: 'QB', side: OFFENSE},
  { id: 2, name: 'Halfback', abbreviatedName: 'HB', side: OFFENSE},
  { id: 3, name: 'Fullback', abbreviatedName: 'FB', side: OFFENSE},
  { id: 4, name: 'Tight End', abbreviatedName: 'TE', side: OFFENSE},
  { id: 5, name: 'Tackle', abbreviatedName: 'OT', side: OFFENSE},
  { id: 6, name: 'Guard', abbreviatedName: 'G', side: OFFENSE},
  { id: 7, name: 'Center', abbreviatedName: 'C', side: OFFENSE},
  { id: 8, name: 'Wide Reciever', abbreviatedName: 'WR', side: OFFENSE},
];

export const DEFENSIVE_POSITIONS: Position[] = [
  { id: 10, name: 'Middle Linebacker', abbreviatedName: 'MLB', side: DEFENSE},
  { id: 11, name: 'Outside Linebacker', abbreviatedName: 'OLB', side: DEFENSE},
  { id: 12, name: 'Defensive Tackle', abbreviatedName: 'DT', side: DEFENSE},
  { id: 13, name: 'Defensive End', abbreviatedName: 'DE', side: DEFENSE},
  { id: 14, name: 'Nose Guard', abbreviatedName: 'NG', side: DEFENSE},
  { id: 15, name: 'Cornerback', abbreviatedName: 'CB', side: DEFENSE},
  { id: 16, name: 'Free Safety', abbreviatedName: 'FS', side: DEFENSE},
  { id: 17, name: 'Strong Safety', abbreviatedName: 'SS', side: DEFENSE},
];

export const SPECIAL_TEAMS_POSITIONS: Position[] = [
  { id: 20, name: 'Kicker', abbreviatedName: 'K', side: SPECIAL_TEAMS},
  { id: 21, name: 'Punter', abbreviatedName: 'P', side: SPECIAL_TEAMS},
];
