import { Component, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef, HostListener } from '@angular/core';
import { PositionsService } from './services/positions.service';
import { DisplaypositionComponent } from './position/displayposition/displayposition.component';
import { Position } from './position/position';
import { MatSidenav, MatExpansionPanel, MatAccordion } from '@angular/material';

const basePosition: Position = { id: 0, name: '', abbreviatedName: '', side: ''};
const fieldLimit = 11;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  positionButtonToggle = '>';
  detailButtonToggle = '<';
  version = '0.0.3';
  isMouseDown = false;
  incrementedId = 100;

  selectedPosition: Position = basePosition;

  holdPositionComponentRef: ComponentRef<DisplaypositionComponent> = null;
  selectedPositionElement: HTMLElement;
  holdPosition: DisplaypositionComponent = null;

  positions: Map<number, ComponentRef<DisplaypositionComponent>> = new Map();

  @ViewChild('main', { read: ViewContainerRef}) main: ViewContainerRef;
  @ViewChild('field', { read: ViewContainerRef}) field: ViewContainerRef;
  @ViewChild('detailNavBar') detailPanel: MatSidenav;
  @ViewChild('positionBar') positionPanel: MatSidenav;
  @ViewChild('positionHolder') positionHolder: MatAccordion;
  @ViewChild('offensePanel') offensePanel: MatExpansionPanel;
  @ViewChild('defensePanel') defensePanel: MatExpansionPanel;
  @ViewChild('specialTeamsPanel') specialTeamsPanel: MatExpansionPanel;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedPosition.id !== 0) {
      this.removeSelectedPosition();
      this.detailPanel.close();
    }
    if (event.key === 'Escape') {
      console.log('here');
      this.detailPanel.close();
    }
  }

  constructor(
    private positionService: PositionsService,
    private componentFactoryResolver: ComponentFactoryResolver ) {
    this.positionService = positionService;
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.isMouseDown || this.selectedPositionElement === undefined || this.selectedPositionElement === null) {
      return;
    }
    this.moveHoldPositionElement(event.clientX, event.clientY);
  }

  moveHoldPositionElement(x: number, y: number) {
    if (this.selectedPositionElement === null || this.selectedPositionElement === undefined) {
      return;
    }
    this.selectedPositionElement.style.left = (x - this.selectedPositionElement.offsetWidth / 2) + 'px';
    this.selectedPositionElement.style.top = (y - this.selectedPositionElement.offsetHeight / 2) + 'px';
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

    const pCopy: Position = { id: this.incrementedId, name: position.name, abbreviatedName: position.abbreviatedName, side: position.side};
    this.incrementedId ++;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DisplaypositionComponent);

    this.holdPositionComponentRef = this.main.createComponent(componentFactory);
    this.holdPosition = this.holdPositionComponentRef.instance;
    this.holdPosition.position = pCopy;
    this.selectedPositionElement = this.holdPositionComponentRef.location.nativeElement;

    this.addPosition(pCopy, this.holdPositionComponentRef);

    this.selectedPositionElement.style.zIndex = '1';
    this.selectedPositionElement.style.position = 'absolute';
    this.selectedPositionElement.style.borderStyle = 'solid';
    this.selectedPositionElement.style.borderWidth = '2px';
    this.selectedPositionElement.style.borderRadius = '50%';
    this.selectedPositionElement.style.borderColor = 'gray';
    this.selectedPositionElement.addEventListener('mouseup', this.mouseup.bind(this));
    this.selectedPositionElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.holdPositionComponentRef.instance.selected.subscribe((p: Position) => {
      this.handleFieldPositionSelected(p);
    });

    this.moveHoldPositionElement(event.clientX, event.clientY);
  }

  addPosition(position: Position, component: ComponentRef<DisplaypositionComponent>) {
    this.positions.set(position.id, component);
    if (this.positions.size >= fieldLimit) {
      this.offensePanel.close();
      this.defensePanel.close();
      this.specialTeamsPanel.close();
      this.positionPanel.close();
    }
  }

  removeSelectedPosition() {
    this.positions.get(this.selectedPosition.id).destroy();
    this.positions.delete(this.selectedPosition.id);
    this.selectedPosition = basePosition;
    this.selectedPositionElement = null;
    this.holdPositionComponentRef = null;
    this.holdPosition = null;
    if (this.positions.size < fieldLimit) {
      this.positionPanel.open();
    }
  }

  mouseup(event: MouseEvent) {
    this.isMouseDown = false;
    if (this.holdPositionComponentRef == null) {
      return;
    }
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
           this.placePositionOnField();
    } else {
      this.holdPositionComponentRef.destroy();
    }

    this.holdPositionComponentRef = null;
    this.holdPosition = null;
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
    this.selectedPositionElement.style.borderColor = 'yellow';
  }

  placePositionOnField() {
    this.handleFieldPositionSelected(this.holdPosition.position);
  }

  handleFieldClick() {
    if (this.positionPanel.opened && this.positions.size >= fieldLimit) {
      this.positionPanel.close();
    }
  }
}
