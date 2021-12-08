import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  log(value: any): void {
    if (environment.logging) {
      console.log(value);
    }
  }
}
