import { Injectable } from '@angular/core';
import { Position } from '../position/position';
import { Location } from '../location';

@Injectable({
  providedIn: 'root'
})
export class PlayValidationService {

  constructor() { }


  /**
   * There are much better and more efficient ways to handle this. But for now it works and that is good enough
   */
  handleValidation(queue: Position[], ballLocation: Location): boolean {
    const NORTH_OF_BALL = 'NORTH';
    const SOUTH_OF_BALL = 'SOUTH';
    const cycleLimit = 50;
    let cycleCount = 0;
    let finished;
    let sideOfBall = '';
    do {
      cycleCount ++;
      finished = true;
      /**
       * This is a quick catch in case we get stuck in a recursion loop.
       */
      if (cycleCount >= cycleLimit) {
        break;
      }

      for (let i = 0; i < queue.length - 1; i ++) {
        const currentPosition: Position = queue[i];
        const comparePosition: Position = queue[i + 1];
        const currentSideOfBall = currentPosition.y > ballLocation.y ? SOUTH_OF_BALL : NORTH_OF_BALL;
        if (sideOfBall === '') {
          sideOfBall = currentSideOfBall;
        }
        if (currentSideOfBall !== sideOfBall) {
          console.log('Cannot finish validation as the players are not on the same side of the ball. Please correct and try again');
          cycleCount = cycleLimit;
          break;
        }

        let compValue = currentPosition.compareX(comparePosition);
        if (compValue === 0) {
          compValue = currentPosition.compareY(comparePosition, sideOfBall === NORTH_OF_BALL);
        }
        if (compValue === 1) {
          finished = false;
          [queue[i], queue[i + 1]] = [queue[i + 1], queue[i]];
        }
      }
  } while (!finished);
    if (cycleCount >= cycleLimit) {
      console.log(
        'Breaking Validation due to being stuck in loop. Validation Failed. Please file bug report at' +
        'https://github.com/miversen33/PP-Formation-Webpage/issues');
        return false;
    } else {
      for (let i = 0; i < queue.length; i++) {
        queue[i].slot = i;
      }
      return true;
  }

  }

}
