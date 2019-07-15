import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { VersionFetcherService } from '../services/verionfetcher.service';
import { PositionsService } from '../services/positions.service';
import { MatSelectChange} from '@angular/material';
import { Location } from '../location';
import { AbstractWebDriver } from 'protractor/built/browser';
import { Position } from '../position/position';

const basePosition: Position = new Position(0, '', '', '');

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
    this.xValue = Math.floor(position.displayX);
    this.yValue = Math.floor(position.displayY);
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
    /**
     * Multiplying by -1 to get the desired difference
     */
    const xDiff = (this.xValue - xCache) * -1;
    const yDiff = this.yValue - yCache;
    this.selectedPositionLocationChanged.emit({x: xDiff, y: yDiff});
  }

  updateDisplayLocation(x: number, y: number) {
    x = Math.floor(x);
    y = Math.floor(y);
    this.xValue = x;
    this.yValue = y;
  }

  moveSelectedPosition(x: number, y: number, displayX: number, displayY: number) {
    this.updateDisplayLocation(displayX, displayY);
    x = Math.floor(x);
    y = Math.floor(y);
    this.selectedPosition.x = x;
    this.selectedPosition.y = y;
    this.selectedPosition.displayX = displayX;
    this.selectedPosition.displayY = displayY;
  }

}
