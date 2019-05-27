import { Component, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef, HostListener } from '@angular/core';
import { PositionsService } from './services/positions.service';
import { DisplaypositionComponent } from './position/displayposition/displayposition.component';
import { Position } from './position/position';
import { QueryList } from '@angular/core/src/render3/query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  positionButtonToggle = '>';
  detailButtonToggle = '<';
  detailBarOpen = false;
  version = '0.0.1';
  isMouseDown = false;

  selectedPosition: Position = { id: 0, name: '', abbreviatedName: '', side: '', timestamp: ''};

  holdPositionComponentRef: ComponentRef<DisplaypositionComponent> = null;
  holdPositionElement: HTMLElement;
  holdPosition: DisplaypositionComponent = null;

  positions: Map<string, HTMLElement> = new Map();

  @ViewChild('main', { read: ViewContainerRef}) main: ViewContainerRef;
  @ViewChild('field', { read: ViewContainerRef}) field: ViewContainerRef;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

  }

  constructor(
    private positionService: PositionsService,
    private componentFactoryResolver: ComponentFactoryResolver ) {
    this.positionService = positionService;
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.isMouseDown || this.holdPositionElement === undefined || this.holdPositionElement === null) {
      return;
    }
    this.moveHoldPositionElement(event.clientX, event.clientY);
  }

  moveHoldPositionElement(x: number, y: number) {
    if (this.holdPositionElement === null || this.holdPositionElement === undefined) {
      return;
    }
    this.holdPositionElement.style.left = (x - this.holdPositionElement.offsetWidth / 2) + 'px';
    this.holdPositionElement.style.top = (y - this.holdPositionElement.offsetHeight / 2) + 'px';
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
    this.isMouseDown = true;

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DisplaypositionComponent);

    this.holdPositionComponentRef = this.main.createComponent(componentFactory);
    this.holdPosition = this.holdPositionComponentRef.instance;
    this.holdPositionElement = this.holdPositionComponentRef.location.nativeElement;

    const timestamp = this.holdPositionComponentRef.instance.setPosition(position);
    this.positions.set(timestamp, this.holdPositionElement);

    this.holdPositionElement.style.zIndex = '1';
    this.holdPositionElement.style.position = 'absolute';
    this.holdPositionElement.addEventListener('mouseup', this.mouseup.bind(this));
    this.holdPositionElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.holdPositionComponentRef.instance.selected.subscribe((p: Position) => {
      this.handleFieldPositionSelected(p);
    });

    this.moveHoldPositionElement(event.clientX, event.clientY);
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
    this.holdPositionElement = null;
  }

  handleFieldPositionSelected(position: Position) {
    if (this.selectedPosition.id !== 0) {
      console.log('Changing shit');
      this.positions.get(this.selectedPosition.timestamp).style.borderColor = 'yellow';
    }
    this.selectedPosition = position;
    this.detailBarOpen = true;
    const positionElement = this.positions.get(position.timestamp);
    positionElement.style.borderColor = 'yellow';
  }

  placePositionOnField() {
    this.handleFieldPositionSelected(this.holdPosition.position);
  }
}
