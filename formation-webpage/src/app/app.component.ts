import { Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  HostListener,
  AfterViewInit,
  ElementRef,
} from '@angular/core';

import { PositionsService } from './services/positions.service';
import { DisplaypositionComponent } from './position/displayposition/displayposition.component';
import { Position } from './position/position';
import { MatSidenav, MatAccordion, MatButton } from '@angular/material';
import { PositionbarComponent } from './positionbar/positionbar.component';
import { PositionSelector } from './positionbar/positionSelector';
import { DetailbarComponent } from './detailbar/detailbar.component';
import { FieldComponent } from './field/field.component';
import { Location } from './location';
import { CdkDragMove, CdkDragRelease } from '@angular/cdk/drag-drop/typings/drag-events';
import { DragRef } from '@angular/cdk/drag-drop';

const basePosition: Position = { id: 0, name: '', abbreviatedName: '', side: '', x: 0, y: 0, displayX: 0, displayY: 0};
const fieldLimit = 11;
const gridHeightLimit = 20;
const minPlayerGap = 5;
const selectionColor = 'yellow';
const deleteColor = 'red';
const xSnapLimit = 20;
const ySnapLimit = 15;
const feetWidth = 160;
const feetHeight = 120;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  isMouseDown = false;
  incrementedId = 100;
  shiftBeingHeld = false;
  shiftHandled = false;
  controlBeingHeld = false;
  pendingDelete = false;
  ballLocation: Location = new Location();
  initialBallLocation: Location = new Location();
  cacheBallDragReference: DragRef;
  feetWidthConversion = 1;
  feetHeightConversion = 1;

  selectedPositionElement: HTMLElement;

  positions: Map<number, ComponentRef<DisplaypositionComponent>> = new Map();

  @ViewChild('main', { read: ViewContainerRef}) main: ViewContainerRef;
  @ViewChild('field', { read: ViewContainerRef}) fieldRef: ViewContainerRef;
  @ViewChild('field') field: FieldComponent;
  @ViewChild('detailBar') detailPanel: MatSidenav;
  @ViewChild('positionBar', { read: ViewContainerRef}) positionBarRef: ViewContainerRef;
  @ViewChild('positionBar') positionBar: MatSidenav;
  @ViewChild('propertiesPanel') propertiesPanel: DetailbarComponent;
  @ViewChild('positionHolder') positionHolder: MatAccordion;
  @ViewChild('positionPanel') positionPanel: PositionbarComponent;
  @ViewChild('positionBarToggle') leftToggleButton: MatButton;
  @ViewChild('deletePosition') deletePosition: ElementRef;
  @ViewChild('ball') ball: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.detailPanel.close();
    }
    if (event.key === 'Shift') {
      this.shiftBeingHeld = true;
    }
    if (event.key === 'Control') {
      this.controlBeingHeld = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.shiftBeingHeld = false;
    }
    if (event.key === 'Control') {
      this.controlBeingHeld = false;
    }
  }

  ngAfterViewInit(): void {
    const grid = this.field.getCanvas();
    const canvas: CanvasRenderingContext2D = grid.getContext('2d');
    const diff = grid.offsetHeight / gridHeightLimit;
    const diff2 = diff / 5;
    const greedyDiff = diff / 10;
    const width = grid.offsetWidth;

    const majorLineStyle = 'gray';
    const minorLineStyle = 'lightGray';

    canvas.beginPath();
    for (let line = greedyDiff; line < grid.offsetHeight - greedyDiff; line += greedyDiff) {
      let style = minorLineStyle;
      let thickness = .15;
      if ((Math.round(line * 100) % Math.round(diff * 100)) === 0) {
        thickness = .20;
        style = majorLineStyle;
      }
      if ((Math.round(line * 100) % Math.round(diff2 * 100)) === 0) {
        thickness = .20;
      }
      canvas.fillStyle = style;
      canvas.fillRect(0, line, width, thickness);
    }

    canvas.closePath();
    this.feetWidthConversion = grid.offsetWidth / feetWidth;
    this.feetHeightConversion = grid.offsetHeight / feetHeight;

    this.ballLocation.x = this.ball.nativeElement.getBoundingClientRect().x + (this.ball.nativeElement.offsetWidth / 2);
    this.ballLocation.y = this.ball.nativeElement.getBoundingClientRect().y + (this.ball.nativeElement.offsetHeight / 2);
    this.initialBallLocation.x = this.ballLocation.x;
    this.initialBallLocation.y = this.ballLocation.y;
  }

  constructor(
    private positionService: PositionsService,
    private componentFactoryResolver: ComponentFactoryResolver) {
  }

  handleMouseMove(event: MouseEvent) {
    if (
      !this.isMouseDown || this.selectedPositionElement === undefined || this.selectedPositionElement === null) {
      return;
    }

    if (!this.shiftHandled && this.positions.size < fieldLimit && this.shiftBeingHeld) {
      this.shiftHandled = true;
      this.cloneSelectedPosition();
      this.moveHoldPositionElement(event.clientX, event.clientY, false);
    } else {
      this.moveHoldPositionElement(event.clientX, event.clientY, false);
    }

    this.deletePosition.nativeElement.style.visibility = 'visible';
    const offsetLeft = this.getPositionBarWidth();
    const curLeft = this.selectedPositionElement.offsetLeft - offsetLeft;
    const curTop = this.selectedPositionElement.offsetTop;
    const curRight = this.selectedPositionElement.offsetWidth + curLeft;
    const curBottom = this.selectedPositionElement.offsetHeight + curTop;
    if (this.checkIfMoveIsInDelete(curLeft, curTop, curRight, curBottom)) {
      this.pendingDelete = true;
      this.deletePosition.nativeElement.style.backgroundColor = 'red';
    } else {
      this.pendingDelete = false;
      this.deletePosition.nativeElement.style.backgroundColor = 'blue';
    }
  }

  cloneSelectedPosition() {
    const positionClone = this.positionService.clonePosition(this.propertiesPanel.getSelectedPosition(), this.incrementedId);
    this.incrementedId ++;
    this.createPosition(positionClone);
  }

  moveHoldPositionElement(inX: number, inY: number, manuallyMoved: boolean) {
    if (this.selectedPositionElement === null || this.selectedPositionElement === undefined) {
      return;
    }

    const snaps = this.getSnapLocation(inX, inY, (manuallyMoved || this.controlBeingHeld));

    if (snaps === undefined) {
      return;
    }

    let x = inX;
    let y = inY;

    if (inX !== this.propertiesPanel.getSelectedPosition().x) {
      x = snaps[0];
      if (!manuallyMoved) {
        x -= (this.selectedPositionElement.offsetWidth / 2);
      }
    }

    if (inY !== this.propertiesPanel.getSelectedPosition().y ) {
      y = snaps[1];
      if (!manuallyMoved) {
        y -= (this.selectedPositionElement.offsetHeight / 2);
      }
    }

    const displayX = Math.floor(x - this.ballLocation.x + (this.selectedPositionElement.offsetWidth / 2)) / this.feetWidthConversion;
    const displayY = Math.floor(y - this.ballLocation.y + (this.selectedPositionElement.offsetHeight / 2)) / this.feetHeightConversion;

    this.propertiesPanel.moveSelectedPosition(x, y, displayX, displayY);

    this.selectedPositionElement.style.left = this.propertiesPanel.getSelectedPosition().x + 'px';
    this.selectedPositionElement.style.top = this.propertiesPanel.getSelectedPosition().y + 'px';


    if (this.selectedPositionElement === null || this.selectedPositionElement === undefined) {
      return;
    }
  }

  handlePositionSelected(event: PositionSelector) {
    if (this.positions.size >= fieldLimit) {
      return;
    }
    this.isMouseDown = true;

    const pCopy: Position = this.positionService.clonePosition(event.position, this.incrementedId);
    this.incrementedId ++;
    this.createPosition(pCopy);

    this.moveHoldPositionElement(event.x, event.y, false);
  }

  handlePositionMoved(locationChange: Location) {
    const checkLocation = {
      x: this.propertiesPanel.getSelectedPosition().x + locationChange.x,
      y: this.propertiesPanel.getSelectedPosition().y + locationChange.y};
    if (this.checkIfLocationOverlapsPosition(checkLocation.x, checkLocation.y)) {
      return;
    }
    this.selectedPositionElement = this.positions.get(this.propertiesPanel.getSelectedPosition().id).location.nativeElement;
    this.moveHoldPositionElement(checkLocation.x, checkLocation.y, true);
    this.selectedPositionElement = null;
  }

  addPosition(position: Position, component: ComponentRef<DisplaypositionComponent>) {
    this.positions.set(position.id, component);
    if (this.positions.size >= fieldLimit) {
      this.field.disablePositionButton();
      this.positionPanel.closeAll();
      this.positionBar.close();
    }
  }

  removeSelectedPosition() {
    this.removePosition(this.propertiesPanel.getSelectedPosition().id);
  }

  removePosition(position: number) {
    this.positions.get(position).destroy();
    this.positions.delete(position);
    this.propertiesPanel.setSelectedPosition(basePosition);
    this.selectedPositionElement = null;
    if (this.positions.size < fieldLimit) {
      this.field.enablePositionButton();
      this.positionBar.open();
    }
  }

  createPosition(position: Position) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DisplaypositionComponent);

    const componentRef = this.main.createComponent(componentFactory);
    componentRef.instance.position = position;
    this.selectedPositionElement = componentRef.location.nativeElement;

    this.addPosition(position, componentRef);

    this.selectedPositionElement.style.zIndex = '1';
    this.selectedPositionElement.style.position = 'absolute';
    this.selectedPositionElement.style.borderStyle = 'solid';
    this.selectedPositionElement.style.borderWidth = '2px';
    this.selectedPositionElement.style.borderRadius = '50%';
    this.selectedPositionElement.style.borderColor = 'gray';
    this.selectedPositionElement.addEventListener('mouseup', this.mouseup.bind(this));
    this.selectedPositionElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
    componentRef.instance.selected.subscribe((p: Position) => {
      this.handleFieldPositionSelected(p);
    });

    this.handleFieldPositionSelected(position);

  }

  phantomMouseUp() {
    this.isMouseDown = false;
  }

  mouseup(event: MouseEvent) {
    this.isMouseDown = false;
    this.shiftHandled = false;

    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const left = this.fieldRef.element.nativeElement.getBoundingClientRect().left;
    const top = this.fieldRef.element.nativeElement.getBoundingClientRect().top;
    const right = this.fieldRef.element.nativeElement.getBoundingClientRect().right;
    const bottom = this.fieldRef.element.nativeElement.getBoundingClientRect().bottom;

    if (((mouseX < right) &&
         (mouseX > left)) &&
        ((mouseY < bottom) &&
         (mouseY > top))) {
           this.placePositionOnField();
    } else {
      this.removePosition(this.propertiesPanel.getSelectedPosition().id);
    }

    if (this.pendingDelete) {
      this.deletePosition.nativeElement.style.backgroundColor = 'blue';
      this.removeSelectedPosition();
    }
    this.deletePosition.nativeElement.style.visibility = 'hidden';
    this.selectedPositionElement = null;
  }

  checkIfMoveIsInDelete(left: number, top: number, right: number, bottom: number): boolean {
    const delLeft = this.deletePosition.nativeElement.offsetLeft;
    const delTop = this.deletePosition.nativeElement.offsetTop;
    const delRight = this.deletePosition.nativeElement.offsetWidth + delLeft;
    const delBottom = this.deletePosition.nativeElement.offsetHeight + delTop;

    const horizontalContained = ((delLeft <= left && delRight >= left) || (delLeft <= right && delRight >= right));
    const verticalContained = ((delTop <= top && delBottom >= top) || (delTop <= bottom && delBottom >= bottom));

    return (horizontalContained && verticalContained);
  }

  getPositionBarWidth(): number {
    if (this.positionBar.opened) {
      return this.positionBarRef.element.nativeElement.offsetWidth;
    } else {
      return 0;
    }
  }

  handleFieldPositionSelected(position: Position) {
    this.isMouseDown = true;
    if (this.propertiesPanel.getSelectedPosition().id !== 0) {
      this.positions.get(this.propertiesPanel.getSelectedPosition().id).location.nativeElement.style.borderColor = 'gray';
    }
    this.selectedPositionElement = this.positions.get(position.id).location.nativeElement;
    this.selectedPositionElement.style.borderColor = selectionColor;
    this.propertiesPanel.setSelectedPosition(position);

    this.detailPanel.open();
  }

  onPositionBarOpened(): void {
    this.field.positionPanelOpened();
  }

  onPositionBarClosed(): void {
    this.field.positionPanelClosed();
  }

  onDetailBarClosed(): void {
    this.field.detailPanelClosed();
  }

  onDetailBarOpened(): void {
    this.field.detailPanelOpened();
  }

  placePositionOnField() {
    this.handleFieldPositionSelected(this.propertiesPanel.getSelectedPosition());
  }

  handleFieldClick() {
    if (this.positionBar.opened && this.positions.size >= fieldLimit) {
      this.positionBar.close();
    }
  }

  handleReset() {
    for (const key of Array.from(this.positions.keys())) {
      this.removePosition(key);
    }
    this.detailPanel.close();
    this.positionBar.open();
    if (this.cacheBallDragReference !== undefined && this.cacheBallDragReference !== null) {
      this.cacheBallDragReference.reset();
      this.ballLocation.x = this.initialBallLocation.x;
      this.ballLocation.y = this.initialBallLocation.y;
    }
  }

  handleEnterDeletePosition() {
    this.pendingDelete = true;
    this.deletePosition.nativeElement.style.backgroundColor = 'red';
  }

  handleExitDeletePosition() {
    this.pendingDelete = false;
    this.deletePosition.nativeElement.style.backgroundColor = 'blue';
  }

  checkIfLocationOverlapsPosition(xPosition: number, yPosition: number): boolean {
    let overlap = false;
    for (const key of Array.from(this.positions.keys())) {
      if (key === this.propertiesPanel.getSelectedPosition().id) {
        continue;
      }
      const position: ComponentRef<DisplaypositionComponent> = this.positions.get(key);
      const curRadius = position.location.nativeElement.offsetWidth;
      const curLocation: [number, number] =
        [position.location.nativeElement.offsetLeft + (curRadius / 2),
         position.location.nativeElement.offsetTop + (curRadius / 2)];

      const radiusLimit = curRadius + minPlayerGap;
      overlap =
        Math.sqrt((Math.pow((curLocation[0] - xPosition) , 2) + Math.pow((curLocation[1] - yPosition) , 2))) <= radiusLimit;
      if (overlap) {
        break;
      }
    }
    return overlap;
  }

  handleBallReleased(event: CdkDragRelease) {
    this.cacheBallDragReference = event.source._dragRef;
  }

  handleBallMoved(event: CdkDragMove) {
    const cacheX = event.source.element.nativeElement.getBoundingClientRect().left + (this.ball.nativeElement.offsetWidth / 2);
    const cacheY = event.source.element.nativeElement.getBoundingClientRect().top + (this.ball.nativeElement.offsetHeight / 2);
    this.handleUpdateLocations(this.ballLocation.x - cacheX, this.ballLocation.y - cacheY);
    this.ballLocation.x = cacheX;
    this.ballLocation.y = cacheY;
  }

  handleUpdateLocations(ballChangeX: number, ballChangeY: number) {
    for (const key of Array.from(this.positions.keys())) {
      const position = this.positions.get(key).instance.position;
      position.displayX -= ballChangeX;
      position.displayY -= ballChangeY;
    }
    this.propertiesPanel.updateDisplayLocation(this.propertiesPanel.getSelectedPosition().displayX, this.propertiesPanel.getSelectedPosition().displayY);
  }

  getSnapLocation(mouseX: number, mouseY: number, ignoreSnaps: boolean): [number, number] {
    let x = mouseX;
    let y = mouseY;

    if (Math.abs(mouseX - this.ballLocation.x) <= xSnapLimit && !this.checkIfLocationOverlapsPosition(this.ballLocation.x, y)) {
      x = this.ballLocation.x;
    }

    if (Math.abs(mouseY - this.ballLocation.y) <= ySnapLimit && !this.checkIfLocationOverlapsPosition(x, this.ballLocation.y)) {
      y = this.ballLocation.y;
    }

    if (this.positions.size === 1) {
      return [x, y];
    }

    if (this.checkIfLocationOverlapsPosition(mouseX, mouseY)) {
      return undefined;
    }

    for (const key of Array.from(this.positions.keys())) {
      if (this.propertiesPanel.getSelectedPosition().id === key) {
        continue;
      }

      const position = this.positions.get(key).location.nativeElement;

      const pX =
        position.offsetLeft +
        (position.offsetWidth / 2);
      const pY =
        position.offsetTop +
        (position.offsetHeight / 2);

      if (Math.abs(mouseX - pX) <= xSnapLimit && !this.checkIfLocationOverlapsPosition(pX, y)) {
        x = pX;
      }

      if (Math.abs(mouseY - pY) <= ySnapLimit && !this.checkIfLocationOverlapsPosition(x, pY)) {
        y = pY;
      }

      if (x !== mouseX || y !== mouseY) {
        break;
      }
    }

    if (ignoreSnaps) {
      x = mouseX;
      y = mouseY;
    }

    return [x, y];
  }
}
