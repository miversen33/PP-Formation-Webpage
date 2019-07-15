export class Position {
  id: number;
  name: string;
  abbreviatedName: string;
  side: string;
  x = 0;
  y = 0;
  displayX = 0;
  displayY = 0;
  slot: number ;

  constructor(id: number, name: string, abbreviatedName: string, side: string) {
    this.id = id;
    this.name = name;
    this.abbreviatedName = abbreviatedName;
    this.side = side;
  }

  setSlot(slot: number) {
    this.slot = slot;
  }

  setPhysicalLocation(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setDisplayLocation(x: number, y: number) {
    this.displayX = x;
    this.displayY = y;
  }

  clone(newId: number): Position {
    const position: Position = new Position(newId, this.name, this.abbreviatedName, this.side);
    position.x = this.x;
    position.y = this.y;
    position.displayX = this.displayX;
    position.displayY = this.displayY;
    position.slot = this.slot;

    return position;
  }

  /**
   * Must return -1 if this object is 'less than' other, +1 if it is
   * 'greater than' other, or 0 if they are equal
   */
  compareX(position: Position): number {
    if (this.x < position.x) {
      return -1;
    }
    if (this.x > position.x) {
      return 1;
    }
    return 0;
  }

  compareY(position: Position, northOfBall: boolean): number {
    if (this.y > position.y) {
      if (northOfBall) {
        return -1;
      } else {
        return 1;
      }
    } else {
      if (northOfBall) {
        return 1;
      } else {
        return -1;
      }
    }
  }
}
