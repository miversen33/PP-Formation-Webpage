import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { VersionFetcherService } from '../services/verionfetcher.service';
import { Position } from '../position/position';
import { PositionsService } from '../services/positions.service';
import { MatSelectChange} from '@angular/material';
import { Location } from '../location';

const basePosition: Position = {id: 0, name: '', abbreviatedName: '', side: '', x: 0, y: 0, displayX: 0, displayY: 0};

@Component({
  selector: 'app-detailbar',
  templateUrl: './detailbar.component.html',
  styleUrls: ['./detailbar.component.css']
})
export class DetailbarComponent implements OnInit {

  @ViewChild('positionDetails', { read: ViewContainerRef}) positionDetailsRef: ViewContainerRef;
  @ViewChild('xInput') xInput: ElementRef;
  @ViewChild('yInput') yInput: ElementRef;

  @Output() selectedPositionLocationChanged = new EventEmitter<Location>();

  version = '';
  selectedPosition = basePosition;
  highlightedPosition = undefined;
  xValue: number;
  yValue: number;

  constructor(
    private versionService: VersionFetcherService,
    private positionService: PositionsService) {
    this.version = this.versionService.getVersion();
  }

  ngOnInit() {

  }

  getSelectedPosition(): Position {
    return this.selectedPosition;
  }

  setSelectedPosition(position: Position): void {
    if (this.selectedPosition.id === position.id) {
      return;
    }
    this.highlightedPosition = undefined;
    this.selectedPosition = position;
    this.xValue = position.displayX;
    this.yValue = position.displayY;
    if (this.selectedPosition.id === 0) {
      this.positionDetailsRef.element.nativeElement.style.visibility = 'hidden';
    } else {
      this.positionDetailsRef.element.nativeElement.style.visibility = 'visible';
    }
  }

  getAvailablePositions(): Position[] {
    return this.positionService.getPositions();
  }

  handlePositionChanged(option: MatSelectChange) {
    const position: Position = option.source.value;
    this.selectedPosition.name = position.name;
    this.selectedPosition.abbreviatedName = position.abbreviatedName;
    this.selectedPosition.side = position.side;
  }

  handleChange() {
    const xCache = Number(this.xInput.nativeElement.value);
    const yCache = Number(this.yInput.nativeElement.value);
    this.selectedPositionLocationChanged.emit({x: this.xValue - xCache, y: this.yValue - yCache});
    // this.moveSelectedPosition(xCache, yCache);
  }

  moveSelectedPosition(x: number, y: number, displayX: number, displayY: number) {
    x = Math.floor(x);
    y = Math.floor(y);
    this.xValue = displayX;
    this.yValue = displayY;
    this.selectedPosition.x = x;
    this.selectedPosition.y = y;
  }

}
