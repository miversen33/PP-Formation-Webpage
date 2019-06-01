import { Component, OnInit } from '@angular/core';
import { VersionFetcherService } from '../services/verionfetcher.service';
import { Position } from '../position/position';

@Component({
  selector: 'app-detailbar',
  templateUrl: './detailbar.component.html',
  styleUrls: ['./detailbar.component.css']
})
export class DetailbarComponent implements OnInit {

  version = '';
  selectedPosition = {id: 0, name: '', abbreviatedName: '', side: ''};

  constructor(private versionService: VersionFetcherService) {
    this.version = versionService.getVersion();
  }

  ngOnInit() {
  }

  getSelectedPosition(): Position {
    return this.selectedPosition;
  }

  setSelectedPosition(position: Position): void {
    this.selectedPosition = position;
  }

}
