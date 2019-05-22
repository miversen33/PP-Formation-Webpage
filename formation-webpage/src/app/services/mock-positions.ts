import { Position } from '../position';

const OFFENSE = 'Offense';
const DEFENSE = 'Defense';
const SPECIAL_TEAMS = 'Special Teams';

export const OFFENSIVE_POSITIONS: Position[] = [
  { id: 0, name: 'Quarterback', side: OFFENSE},
  { id: 1, name: 'Halfback', side: OFFENSE},
  { id: 2, name: 'Fullback', side: OFFENSE},
  { id: 3, name: 'Tight End', side: OFFENSE},
  { id: 4, name: 'Tackle', side: OFFENSE},
  { id: 5, name: 'Guard', side: OFFENSE},
  { id: 6, name: 'Center', side: OFFENSE},
  { id: 7, name: 'Wide Reciever', side: OFFENSE},
];

export const DEFENSIVE_POSITIONS: Position[] = [
  { id: 10, name: 'Middle Linebacker', side: DEFENSE},
  { id: 11, name: 'Outside Linebacker', side: DEFENSE},
  { id: 12, name: 'Defensive Tackle', side: DEFENSE},
  { id: 13, name: 'Defensive End', side: DEFENSE},
  { id: 14, name: 'Nose Guard', side: DEFENSE},
  { id: 15, name: 'Cornerback', side: DEFENSE},
  { id: 16, name: 'Free Safety', side: DEFENSE},
  { id: 17, name: 'Strong Safety', side: DEFENSE},
];

export const SPECIAL_TEAMS_POSITIONS: Position[] = [
  { id: 20, name: 'Kicker', side: SPECIAL_TEAMS},
  { id: 21, name: 'Punter', side: SPECIAL_TEAMS},
];
