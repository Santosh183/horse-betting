import { Component, OnInit } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-race-list',
  templateUrl: './race-list.component.html',
  styleUrls: ['./race-list.component.scss']
})
export class RaceListComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  displayedColumns = ['race_no', 'total_horses', 'date', 'details'];
  dataSource: Race[] = [
    {race_no: 1, total_horses: 8,  date: '12-05-1990', details: 'd'},
    {race_no: 2, total_horses: 10, date: '12-05-1990', details: 'd'},
    {race_no: 3, total_horses: 14, date: '12-05-1990', details: 'd'},
    {race_no: 4, total_horses: 12, date: '12-05-1990', details: 'd'},
    {race_no: 5, total_horses: 13, date: '12-05-1990', details: 'd'},
  ];
  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
  }

}
export interface Race {
  total_horses: number;
  race_no: number;
  date: string;
  details: string;
}
