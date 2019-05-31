import { Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  HostListener,
  AfterViewInit,
  ElementRef } from '@angular/core';

import { PositionsService } from './services/positions.service';
import { DisplaypositionComponent } from './position/displayposition/displayposition.component';
import { Position } from './position/position';
import { MatSidenav, MatExpansionPanel, MatAccordion, MatButton } from '@angular/material';

const basePosition: Position = { id: 0, name: '', abbreviatedName: '', side: ''};
const fieldLimit = 11;
const gridHeightLimit = 20;
const selectionColor = 'yellow';
const xSnapLimit = 15;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  positionButtonToggle = '>';
  detailButtonToggle = '<';
  version = '0.0.5';
  isMouseDown = false;
  incrementedId = 100;
  shiftBeingHeld = false;
  shiftHandled = false;
  verticalSnap: number[] = [];
  horizontalSnap: Map<number, number> = new Map();
  snapDistance: number;
  xSnap: number;
  ySnap: number;

  selectedPosition: Position = basePosition;
  selectedPositionElement: HTMLElement;

  positions: Map<number, ComponentRef<DisplaypositionComponent>> = new Map();

  @ViewChild('main', { read: ViewContainerRef}) main: ViewContainerRef;
  @ViewChild('field', { read: ViewContainerRef}) field: ViewContainerRef;
  @ViewChild('detailNavBar') detailPanel: MatSidenav;
  @ViewChild('positionBar') positionPanel: MatSidenav;
  @ViewChild('positionHolder') positionHolder: MatAccordion;
  @ViewChild('offensePanel') offensePanel: MatExpansionPanel;
  @ViewChild('defensePanel') defensePanel: MatExpansionPanel;
  @ViewChild('specialTeamsPanel') specialTeamsPanel: MatExpansionPanel;
  @ViewChild('positionBarToggle') leftToggleButton: MatButton;
  @ViewChild('grid') grid: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) {
    if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedPosition.id !== 0) {
      this.removeSelectedPosition();
      this.detailPanel.close();
    }
    if (event.key === 'Escape') {
      this.detailPanel.close();
    }
    if (event.key === 'Shift') {
      this.shiftBeingHeld = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.shiftBeingHeld = false;
    }
  }

  ngAfterViewInit(): void {
    const canvas: CanvasRenderingContext2D = this.grid.nativeElement.getContext('2d');
    const diff = this.grid.nativeElement.offsetHeight / gridHeightLimit;
    const diff2 = diff / 5;
    const greedyDiff = diff / 10;
    const width = this.grid.nativeElement.offsetWidth;

    const majorLineStyle = 'gray';
    const minorLineStyle = 'lightGray';

    canvas.beginPath();
    for (let line = greedyDiff; line < this.grid.nativeElement.offsetHeight - greedyDiff; line += greedyDiff) {
      let style = minorLineStyle;
      let thickness = .15;
      if ((Math.round(line * 100) % Math.round(diff * 100)) === 0) {
        thickness = .20;
        style = majorLineStyle;
      }
      if ((Math.round(line * 100) % Math.round(diff2 * 100)) === 0) {
        thickness = .20;
      }
      this.verticalSnap[this.verticalSnap.length] = line;
      canvas.fillStyle = style;
      canvas.fillRect(0, line, width, thickness);
    }

    this.snapDistance = greedyDiff;

    canvas.closePath();
  }

  constructor(
    private positionService: PositionsService,
    private componentFactoryResolver: ComponentFactoryResolver ) {
    this.positionService = positionService;
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
  }

  cloneSelectedPosition() {
    const positionClone = this.positionService.clonePosition(this.selectedPosition, this.incrementedId);
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
  }

  onPositionBarClose(): void {
    this.positionButtonToggle = '>';
  }

  onPositionBarOpen(): void {
      this.positionButtonToggle = '<';
  }

  onDetailBarClose(): void {
    this.detailButtonToggle = '<';
  }

  onDetailBarOpen(): void {
      this.detailButtonToggle = '>';
  }

  getOffensivePlayers() {
    return this.positionService.getOffensivePositions();
  }

  getDefensivePlayers() {
    return this.positionService.getDefensivePositions();
  }

  getSpecialTeamsPlayers() {
    return this.positionService.getSpecialTeamsPositions();
  }

  mousedown(event: MouseEvent, position: Position) {
    if (this.positions.size >= fieldLimit) {
      return;
    }
    this.isMouseDown = true;

    const pCopy: Position = this.positionService.clonePosition(position, this.incrementedId);
    this.incrementedId ++;
    this.createPosition(pCopy);

    this.moveHoldPositionElement(event.clientX, event.clientY);
  }

  addPosition(position: Position, component: ComponentRef<DisplaypositionComponent>) {
    this.positions.set(position.id, component);
    if (this.positions.size >= fieldLimit) {
      this.leftToggleButton.disabled = true;
      this.offensePanel.close();
      this.defensePanel.close();
      this.specialTeamsPanel.close();
      this.positionPanel.close();
    }
  }

  removeSelectedPosition() {
    this.removePosition(this.selectedPosition.id);
  }

  removePosition(position: number) {
    this.horizontalSnap.delete(position);
    this.positions.get(position).destroy();
    this.positions.delete(position);
    this.selectedPosition = basePosition;
    this.selectedPositionElement = null;
    if (this.positions.size < fieldLimit) {
      this.leftToggleButton.disabled = false;
      this.positionPanel.open();
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
      console.log(this.selectedPosition);
      this.handleFieldPositionSelected(p);
    });

    this.handleFieldPositionSelected(position);

  }

  mouseup(event: MouseEvent) {
    this.isMouseDown = false;
    this.shiftHandled = false;

    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const left = this.field.element.nativeElement.getBoundingClientRect().left;
    const top = this.field.element.nativeElement.getBoundingClientRect().top;
    const right = this.field.element.nativeElement.getBoundingClientRect().right;
    const bottom = this.field.element.nativeElement.getBoundingClientRect().bottom;

    if (((mouseX < right) &&
         (mouseX > left)) &&
        ((mouseY < bottom) &&
         (mouseY > top))) {
           this.placePositionOnField(mouseX);
    } else {
      this.positions.get(this.selectedPosition.id).destroy();
    }
    this.selectedPositionElement = null;
  }

  handleFieldPositionSelected(position: Position) {
    this.isMouseDown = true;
    if (this.selectedPosition.id !== 0) {
      this.positions.get(this.selectedPosition.id).location.nativeElement.style.borderColor = 'gray';
    }
    this.selectedPosition = position;
    this.detailPanel.open();
    this.selectedPositionElement = this.positions.get(position.id).location.nativeElement;
    this.selectedPositionElement.style.borderColor = selectionColor;
  }

  placePositionOnField(xLocation: number) {
    if (this.horizontalSnap.keys().hasOwnProperty(this.selectedPosition.id)) {
      this.horizontalSnap.delete(this.selectedPosition.id);
    }
    this.horizontalSnap.set(this.selectedPosition.id, xLocation);
    this.handleFieldPositionSelected(this.selectedPosition);
  }

  handleFieldClick() {
    if (this.positionPanel.opened && this.positions.size >= fieldLimit) {
      this.positionPanel.close();
    }
  }

  handleReset() {
    for (const key of Array.from(this.positions.keys())) {
      this.removePosition(key);
    }
    this.detailPanel.close();
    this.positionPanel.open();
  }

  getSnapLocation(mouseX: number, mouseY: number) {
    let prevY = 0;
    this.xSnap = mouseX;
    const countVar = 2;

    for (const key of Array.from(this.horizontalSnap.keys())) {
      const x = this.horizontalSnap.get(key);
      if (Math.abs(mouseX - x) <= xSnapLimit) {
        this.xSnap = x;
        break;
      }
    }

    for (let count = 0; count < this.verticalSnap.length - countVar; count += countVar) {
      const y = this.verticalSnap[count];
      if (mouseY > y) {
        prevY = y;
        continue;
      }
      if (mouseY > prevY && mouseY < y) {
        if (Math.abs(prevY - mouseY) < Math.abs(y - mouseY)) {
          this.ySnap = prevY;
          break;
        } else {
          this.ySnap = y;
          break;
        }
      }
    }
  }
}
