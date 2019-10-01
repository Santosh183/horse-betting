import { Component, OnInit } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';

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

  displayedColumns = ['raceNumber', 'raceHorses', 'raceDate', 'status', 'details'];
  dataSource: Race[] = [];
  /*
    [
      {raceNumber: 1, raceHorses: 8,  raceDate: '12-05-1990', status: 'pending', details: 'd'},
      {raceNumber: 2, raceHorses: 10, raceDate: '12-05-1990', status: 'completed', details: 'd'},
      {raceNumber: 3, raceHorses: 14, raceDate: '12-05-1990', status: 'pending', details: 'd'},
      {raceNumber: 4, raceHorses: 12, raceDate: '12-05-1990', status: 'completed', details: 'd'},
      {raceNumber: 5, raceHorses: 13, raceDate: '12-05-1990', status: 'pending', details: 'd'},
    ]; */

  constructor(private breakpointObserver: BreakpointObserver, private firebase: FirebaseService,
              private router: Router) { }

  ngOnInit() {
    const s = this.firebase.getRaces();
    s.subscribe(
    (races) => {
      this.dataSource = races.map(e => {
            return {
              raceHorses: e.payload.doc.data()[ 'raceHorses'],
              raceNumber: e.payload.doc.data()[ 'raceNumber'],
              raceDate: this.convertToDate(e.payload.doc.data()[ 'raceDate']),
              status: e.payload.doc.data()[ 'status'],
              details: 'd'
            };
        });
      }
    );
  }
  convertToDate(timestamp: any) {
    const d =  new Date(timestamp.seconds * 1000).toISOString().slice(0, 10).split('-');
    return d[2] + '-' + d[1] + '-' + d[0];
  }
  newRace() {
    this.router.navigate(['/newrace']);
  }

}
export interface Race {
  raceHorses: number;
  raceNumber: number;
  raceDate: string;
  status: 'pending' | 'completed';
  details: string;
}
