import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { MatButton } from '@angular/material';
import { Location } from '../location';

const VALIDATION_TITLE = 'Validate';
const SAVE_TITLE = 'Save';
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
  @Output() ballMoved = new EventEmitter<Location>();
  @Output() validatePressed = new EventEmitter();

  @ViewChild('positionBarToggle') positionToggleButton: MatButton;
  @ViewChild('detailBarToggle') detailToggleButton: MatButton;
  @ViewChild('validateButton') validateButton: MatButton;
  @ViewChild('grid') grid: ElementRef;
  @ViewChild('field') field: ElementRef;

  detailButtonToggle = '<';
  positionButtonToggle = '<';
  validationButtonTitle = VALIDATION_TITLE;

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

  enableValidateButton() {
    this.validateButton.disabled = false;
    this.validationButtonTitle = VALIDATION_TITLE;
  }

  flipValidateButton() {
    this.validationButtonTitle = SAVE_TITLE;
  }

  disableValidateButton() {
    this.validateButton.disabled = true;
    this.validationButtonTitle = VALIDATION_TITLE;
  }

  handleValidateButtonPressed() {
    this.validatePressed.emit();
  }

}

