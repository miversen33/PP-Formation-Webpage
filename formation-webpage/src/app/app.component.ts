import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef, Renderer, OnInit } from '@angular/core';
import { PositionsService } from './services/positions.service';
import { Position } from './position/position';
import { DisplaypositionComponent } from './position/displayposition/displayposition.component';

import { trigger, transition} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * TODO
 * MoveEvents that leave the entire browser screen cause the mouse event tracking
 * to act kinda funny (the event registers that you are still in the screen,
 * even though you're not)
 */

export class AppComponent implements OnInit {
  positionButtonToggle = '>';
  detailButtonToggle = '<';
  detailBarOpen = true;
  version = '0.0.1';
  isMouseDown = false;
  document;

  holdPositionComponentRef: ComponentRef<DisplaypositionComponent> = null;
  holdPositionElement;
  holdPosition: DisplaypositionComponent = null;


  @ViewChild('field', { read: ViewContainerRef}) field: ViewContainerRef;

  ngOnInit(): void {
    this.document = document;
  }

  constructor(
    private positionService: PositionsService,
    private componentFactoryResolver: ComponentFactoryResolver ) {
    this.positionService = positionService;
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

  handlePositionClick(position: MatListItem) {
    console.log(position);
  }

  mousemove(event: MouseEvent) {
    if (!this.isMouseDown) {
      return;
    }
    if (this.holdPositionComponentRef === null) {
      return;
    }
  }

  mousedown(position: Position) {
    this.isMouseDown = true;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DisplaypositionComponent);
    this.holdPositionComponentRef = this.field.createComponent(componentFactory);
    this.holdPosition = this.holdPositionComponentRef.instance;
    this.holdPosition.setPosition(position);
  }

  mouseup(mouseX: number, mouseY: number, fieldRect: DOMRect) {
    this.isMouseDown = false;
    if (this.holdPositionComponentRef == null || fieldRect === undefined) {
      return;
    }
    if (((mouseX < fieldRect.right) &&
         (mouseX > fieldRect.left)) &&
        ((mouseY < fieldRect.bottom) &&
         (mouseY > fieldRect.top))) {
          // console.log('Mouse Up in field');
    } else {
      this.holdPositionComponentRef.destroy();
      this.holdPositionComponentRef = null;
      this.holdPosition = null;
    }
  }
}
