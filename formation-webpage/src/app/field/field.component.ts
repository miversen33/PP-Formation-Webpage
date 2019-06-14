import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { MatButton } from '@angular/material';
import { Location } from '../location';
import { CdkDragEnd, CdkDragMove, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit, AfterViewInit {

  @Output() positionBarToggled = new EventEmitter();
  @Output() detailBarToggled = new EventEmitter();
  @Output() resetButtonPressed = new EventEmitter();
  @Output() fieldClicked = new EventEmitter<MouseEvent>();
  @Output() ballMoved = new EventEmitter<Location>();

  @ViewChild('positionBarToggle') positionToggleButton: MatButton;
  @ViewChild('detailBarToggle') detailToggleButton: MatButton;
  @ViewChild('grid') grid: ElementRef;
  @ViewChild('ball') ballRef: ElementRef;
  @ViewChild('field') field: ElementRef;

  detailButtonToggle = '<';
  positionButtonToggle = '<';
  ball: HTMLElement;
  ballLocation: Location;
  source: any;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.ball = this.ballRef.nativeElement;
  }

  getCanvas() {
    return this.grid.nativeElement;
  }

  handleFieldClick(mouseEvent: MouseEvent) {
    this.fieldClicked.emit(mouseEvent);
  }

  handleReset() {
    this.resetButtonPressed.emit();
  }

  handlePositionBarButtonClicked() {
    this.positionBarToggled.emit();
    this.flipPositionButton();
  }

  handleDetailBarButtonClicked() {
    this.detailBarToggled.emit();
    this.flipDetailButton();
  }

  flipDetailButton() {
    if (this.detailButtonToggle === '<') {
      this.detailPanelClosed();
    } else {
      this.detailPanelOpened();
    }
  }

  detailPanelOpened(): void {
    this.detailButtonToggle = '>';
  }

  detailPanelClosed(): void {
    this.detailButtonToggle = '<';
  }

  flipPositionButton() {
    if (this.positionButtonToggle === '<') {
      this.positionPanelClosed();
    } else {
      this.positionPanelOpened();
    }
  }

  positionPanelOpened(): void {
    this.positionButtonToggle = '<';
  }

  positionPanelClosed(): void {
    this.positionButtonToggle = '>';
  }

  disablePositionButton() {
    this.positionToggleButton.disabled = true;
  }

  enablePositionButton() {
    this.positionToggleButton.disabled = false;
  }

  handleBallDrag() {
    this.ballMoved.emit(
      {x: this.ball.offsetLeft + (this.ball.offsetWidth / 2),
       y: this.ball.offsetTop + (this.ball.offsetHeight / 2)}
    );
  }

  handleBallDragDropped(event) {
    this.source = event.source;
  }

  resetBallLocation() {
    this.source._dragRef.reset();
  }
}

