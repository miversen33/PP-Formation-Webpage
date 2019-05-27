import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Position } from '../position';

const select = 'select';
@Component({
  selector: 'app-displayposition',
  templateUrl: './displayposition.component.html',
  styleUrls: ['./displayposition.component.css']
})
export class DisplaypositionComponent implements OnInit {

  @Input() position: Position;
  @Output() selected = new EventEmitter<Position>();

  constructor() { }

  private handleMouseDown() {
    this.selected.emit(this.position);
  }

  ngOnInit() {
  }

}
