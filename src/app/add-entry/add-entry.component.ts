import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit {

  users: any[] = [];
  bets: any[] = [
     'SHP', 'THP', 'RANK', 'WINNER'
  ];
  currentRaceId: any;
  race: any = {
    raceHorses: null
  };
  horses: number[] = [];
  entry: any = {
    bettingType: '',
    horseNumber: null,
    investedAmount: null,
    rank: null,
    rate: null,
    resultChange: null,
    taxRate: null,
    userName: '',
    userNumber: null
  };
  constructor( private route: ActivatedRoute, private location: Location,
               private router: Router, private firebase: FirebaseService ) {}

  ngOnInit() {
    this.currentRaceId = this.route.snapshot.params.raceId;

    const s = this.firebase.getRace(this.currentRaceId);
    s.subscribe(
      (race: any) => {
        this.race.raceHorses = race.payload.data().raceHorses;
        for ( let i = 1; i <= this.race.raceHorses; i++) {
          this.horses.push(i);
        }
      },
      (error) => {
        console.log(error);
      }
    );


    const u = this.firebase.getUsers();
    u.subscribe(
      (users) => {
        this.users = users.map(e => {
          return {
            userNumber: e.payload.doc.data()[ 'userNumber'],
            userName: e.payload.doc.data()[ 'userName'],
            userBalance: e.payload.doc.data()[ 'userBalance'],
          };
        });
      }
    );



  }

  selectUser() {
    for(let i=0; i< this.users.length; i++) {

      if ( this.users[i].userNumber === this.entry.userNumber) {
        this.entry.userName = this.users[i].userName;
      }
    }
  }

  addEntry() {
    this.firebase.addEntry(this.currentRaceId, this.entry).then(
      () => {
        console.log('added new entry to current race');
        this.location.back();
      }
    );
  }

  goBack() {
    this.location.back();
  }

}

interface User {
  userNumber: number;
  userName: string;
}
