import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {

  @Output() positionBarToggled = new EventEmitter();
  @Output() detailBarToggled = new EventEmitter();
  @Output() resetButtonPressed = new EventEmitter();
  @Output() fieldClicked = new EventEmitter<MouseEvent>();

  @ViewChild('positionBarToggle') positionToggleButton: MatButton;
  @ViewChild('detailBarToggle') detailToggleButton: MatButton;
  @ViewChild('grid') grid: ElementRef;
  @ViewChild('ball') ball: ElementRef;

  detailButtonToggle = '<';
  positionButtonToggle = '<';

  constructor() { }

  ngOnInit() {
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

  handleBallDrag(event) {
    console.log(event);
  }
}

