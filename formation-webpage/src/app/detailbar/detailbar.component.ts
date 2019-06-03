import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { VersionFetcherService } from '../services/verionfetcher.service';
import { Position } from '../position/position';
import { MaterialModule } from '../material/material.module';
import { PositionsService } from '../services/positions.service';
import { MatSelectChange, MatOptionSelectionChange } from '@angular/material';

const basePosition: Position = {id: 0, name: '', abbreviatedName: '', side: ''};

@Component({
  selector: 'app-detailbar',
  templateUrl: './detailbar.component.html',
  styleUrls: ['./detailbar.component.css']
})
export class DetailbarComponent implements OnInit {

  @ViewChild('positionDetails', { read: ViewContainerRef}) positionDetailsRef: ViewContainerRef;

  version = '';
  selectedPosition = basePosition;

  constructor(
    private versionService: VersionFetcherService,
    private positionService: PositionsService) {
    this.version = versionService.getVersion();
  }

  ngOnInit() {
  }

  getSelectedPosition(): Position {
    return this.selectedPosition;
  }

  setSelectedPosition(position: Position): void {
    this.selectedPosition = position;
    if (this.selectedPosition.id === 0) {
      this.positionDetailsRef.element.nativeElement.style.visibility = 'hidden';
    } else {
      this.positionDetailsRef.element.nativeElement.style.visibility = 'visible';
    }
  }

  getAvailablePositions(): Position[] {
    return this.positionService.getPositions();
  }

  handlePositionChanged(option: MatOptionSelectionChange) {
    console.log(this.selectedPosition);
    const position: Position = option.source.value;
    this.selectedPosition.name = position.name;
    this.selectedPosition.abbreviatedName = position.abbreviatedName;
    this.selectedPosition.side = position.side;
    console.log(this.selectedPosition);
  }

}
