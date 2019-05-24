import { Component, OnInit } from '@angular/core';
import { Position } from '../position';
import { OFFENSIVE_POSITIONS } from 'src/app/services/mock-positions';

@Component({
  selector: 'app-displayposition',
  templateUrl: './displayposition.component.html',
  styleUrls: ['./displayposition.component.css']
})
export class DisplaypositionComponent implements OnInit {

  position: Position = { id: 0, name: 'undefined', abbreviatedName: 'undefined', side: 'undefined'};

  constructor() { }

  setPosition(position: Position) {
    if (this.position.id === 0) {
      this.position = position;
    }
  }

  ngOnInit() {
  }

}
