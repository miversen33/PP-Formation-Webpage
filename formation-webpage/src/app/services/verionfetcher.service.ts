import { Injectable } from '@angular/core';
import { version } from 'punycode';

@Injectable({
  providedIn: 'root'
})
export class VersionFetcherService {

  private version = '0.0.6';

  constructor() { }

  getVersion(): string {
    return this.version;
  }
}
