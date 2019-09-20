import { Component, OnInit } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

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

  displayedColumns = ['race_no', 'total_horses', 'date', 'status', 'details'];
  dataSource: Race[] = [
    {race_no: 1, total_horses: 8,  date: '12-05-1990', status: 'pending', details: 'd'},
    {race_no: 2, total_horses: 10, date: '12-05-1990', status: 'completed', details: 'd'},
    {race_no: 3, total_horses: 14, date: '12-05-1990', status: 'pending', details: 'd'},
    {race_no: 4, total_horses: 12, date: '12-05-1990', status: 'completed', details: 'd'},
    {race_no: 5, total_horses: 13, date: '12-05-1990', status: 'pending', details: 'd'},
  ];
  constructor(private breakpointObserver: BreakpointObserver, private router: Router) { }

  ngOnInit() {
  }
  newRace() {
    this.router.navigate(['/newrace']);
  }

}
export interface Race {
  total_horses: number;
  race_no: number;
  date: string;
  status: 'pending' | 'completed';
  details: string;
}
