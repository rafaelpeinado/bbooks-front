import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-main-exchange',
  templateUrl: './main-exchange.component.html',
  styleUrls: ['./main-exchange.component.scss']
})
export class MainExchangeComponent implements OnInit, OnDestroy {
  deviceXs: boolean;
  mediaSub: Subscription;

  topVal = 0;

  constructor(
    public mediaObserver: MediaObserver
  ) { }

  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.asObservable().subscribe((result: MediaChange[]) => {
      this.deviceXs = result[0].mqAlias === 'xs' ? true : false;
    });
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }

  sideBarScroll() {
    const e = this.deviceXs ? 117 : 65;
    return e - this.topVal;
  }
  onScroll(e) {
    const scrollXs = this.deviceXs ? 55 : 73;
    if (this.deviceXs) {
      if (e.srcElement.scrollTop < scrollXs) {
        this.topVal = e.srcElement.scrollTop;
      } else {
        this.topVal = scrollXs;
      }
    }
  }
}
