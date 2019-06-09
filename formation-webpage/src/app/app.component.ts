import { Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  HostListener,
  AfterViewInit,
  ElementRef} from '@angular/core';

import { PositionsService } from './services/positions.service';
import { DisplaypositionComponent } from './position/displayposition/displayposition.component';
import { Position } from './position/position';
import { MatSidenav, MatAccordion, MatButton } from '@angular/material';
import { PositionbarComponent } from './positionbar/positionbar.component';
import { PositionSelector } from './positionbar/positionSelector';
import { DetailbarComponent } from './detailbar/detailbar.component';
import { FieldComponent } from './field/field.component';
import { Location } from './location';

const basePosition: Position = { id: 0, name: '', abbreviatedName: '', side: ''};
const fieldLimit = 11;
const gridHeightLimit = 20;
const minPlayerGap = 5;
const selectionColor = 'yellow';
const deleteColor = 'red';
const xSnapLimit = 20;
const ySnapLimit = 15;

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
  xSnap: number;
  ySnap: number;

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
      this.moveHoldPositionElement(event.clientX, event.clientY);
    } else {
      this.moveHoldPositionElement(event.clientX, event.clientY);
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

  moveHoldPositionElement(inX: number, inY: number) {
    if (this.selectedPositionElement === null || this.selectedPositionElement === undefined) {
      return;
    }
    this.getSnapLocation(inX, inY);
    this.selectedPositionElement.style.left = (this.xSnap - this.selectedPositionElement.offsetWidth / 2) + 'px';
    this.selectedPositionElement.style.top = (this.ySnap - this.selectedPositionElement.offsetHeight / 2) + 'px';

    const location = this.getSelectedPositionLocation();
    this.propertiesPanel.moveSelectedPosition(location[0], location[1]);
  }

  handlePositionSelected(event: PositionSelector) {
    if (this.positions.size >= fieldLimit) {
      return;
    }
    this.isMouseDown = true;

    const pCopy: Position = this.positionService.clonePosition(event.position, this.incrementedId);
    this.incrementedId ++;
    this.createPosition(pCopy);

    this.moveHoldPositionElement(event.x, event.y);
  }

  handlePositionMoved(newLocation: Location) {
    if (this.checkIfLocationOverlapsPosition(newLocation.x, newLocation.y)) {
      this.propertiesPanel.rollbackMovement();
      return;
    }
    this.selectedPositionElement = this.positions.get(this.propertiesPanel.getSelectedPosition().id).location.nativeElement;
    this.moveHoldPositionElement(newLocation.x, newLocation.y);
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
    this.propertiesPanel.setSelectedPosition(basePosition, 0, 0);
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
      this.positions.get(this.propertiesPanel.getSelectedPosition().id).destroy();
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

  getSelectedPositionLocation(): [number, number] {
    const left = this.selectedPositionElement.offsetLeft + (this.selectedPositionElement.offsetWidth / 2);
    const top = this.selectedPositionElement.offsetTop + (this.selectedPositionElement.offsetHeight / 2);

    return [left, top];
  }

  handleFieldPositionSelected(position: Position) {
    this.isMouseDown = true;
    if (this.propertiesPanel.getSelectedPosition().id !== 0) {
      this.positions.get(this.propertiesPanel.getSelectedPosition().id).location.nativeElement.style.borderColor = 'gray';
    }
    this.selectedPositionElement = this.positions.get(position.id).location.nativeElement;
    this.selectedPositionElement.style.borderColor = selectionColor;
    const selectedLocation = this.getSelectedPositionLocation();
    this.propertiesPanel.setSelectedPosition(position, selectedLocation[0], selectedLocation[1]);

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

  getSnapLocation(mouseX: number, mouseY: number) {
    let x = mouseX;
    let y = mouseY;

    if (this.positions.size === 1) {
      this.xSnap = x;
      this.ySnap = y;
      return;
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

      if (Math.abs(mouseX - pX) <= xSnapLimit) {
        x = pX;
        break;
      }

      if (Math.abs(mouseY - pY) <= ySnapLimit) {
        y = pY;
        break;
      }
    }

    if (this.controlBeingHeld) {
      x = mouseX;
      y = mouseY;
    }

    if (this.checkIfLocationOverlapsPosition(mouseX, mouseY)) {
      x = this.xSnap;
      y = this.ySnap;
    }

    this.xSnap = x;
    this.ySnap = y;

  }
}
