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
  races: any[] = [];


  constructor(private breakpointObserver: BreakpointObserver, private firebase: FirebaseService,
              private router: Router) { }

  ngOnInit() {
    const s = this.firebase.getRaces();
    s.subscribe(
    (races) => {
      this.races = races.map(e => {
            return {
              raceId: e.payload.doc.id,
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
    let d =  new Date(timestamp.seconds * 1000);
    d = new Date(d.getTime() + Math.abs(d.getTimezoneOffset() * 60000));
    const temp = d.toISOString().slice(0, 10).split('-');
    return temp[2] + '-' + temp[1] + '-' + temp[0];
  }
  newRace() {
    this.router.navigate(['/newrace']);
  }

}

