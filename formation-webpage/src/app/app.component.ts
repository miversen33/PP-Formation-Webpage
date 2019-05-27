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
  version = '0.0.2';
  isMouseDown = false;

  selectedPosition: Position = { id: 0, name: '', abbreviatedName: '', side: '', timestamp: ''};

  holdPositionComponentRef: ComponentRef<DisplaypositionComponent> = null;
  selectedPositionElement: HTMLElement;
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
    this.isMouseDown = true;

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DisplaypositionComponent);

    this.holdPositionComponentRef = this.main.createComponent(componentFactory);
    this.holdPosition = this.holdPositionComponentRef.instance;
    this.selectedPositionElement = this.holdPositionComponentRef.location.nativeElement;

    const timestamp = this.holdPositionComponentRef.instance.setPosition(position);
    this.positions.set(timestamp, this.selectedPositionElement);

    this.selectedPositionElement.style.zIndex = '1';
    this.selectedPositionElement.style.position = 'absolute';
    this.selectedPositionElement.addEventListener('mouseup', this.mouseup.bind(this));
    this.selectedPositionElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
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
    this.selectedPositionElement = null;
  }

  handleFieldPositionSelected(position: Position) {
    console.log(position.timestamp);
    this.isMouseDown = true;
    if (this.selectedPosition.id !== 0) {
      this.positions.get(this.selectedPosition.timestamp).style.backgroundColor = 'white';
    }
    this.selectedPosition = position;
    this.detailBarOpen = true;
    this.selectedPositionElement = this.positions.get(position.timestamp);

    this.selectedPositionElement.style.backgroundColor = 'yellow';
  }

  placePositionOnField() {
    this.handleFieldPositionSelected(this.holdPosition.position);
  }
}
