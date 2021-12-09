import { Component, OnInit } from '@angular/core';
import { CoreService } from '@core/services/core.service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-mat-drawer',
  templateUrl: './mat-drawer.component.html',
  styleUrls: ['./mat-drawer.component.scss'],
})
export class MatDrawerComponent implements OnInit {
  drawerState$: Observable<boolean>;

  constructor(private coreService: CoreService) {
    this.drawerState$ = this.coreService.drawerState$.pipe(shareReplay());
  }

  ngOnInit() {}

  onOpenedChange(state: boolean) {
    if (this.coreService.getDrawerState() !== state) {
      this.coreService.setDrawerState(state);
    }
  }
}
