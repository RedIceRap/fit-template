import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  log(value: any, production = false): void {
    if (
      environment.logging &&
      ((!production && !environment.production) || production)
    ) {
      console.log(value);
    }
  }
}
