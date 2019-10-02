import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss']
})
export class EditEntryComponent implements OnInit {

  users: any[] = [];
  bets: any[] = [
     'SHP', 'THP', 'RANK', 'WINNER'
  ];
  currentRaceId: any;
  currentEntryId: any;
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
    this.currentEntryId = this.route.snapshot.params.entryId;

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

    const entries = this.firebase.getEntryDetails(this.currentRaceId, this.currentEntryId );
    entries.subscribe(
        (entry: any) => {

          console.log(entry.payload.data());
          this.entry =  entry.payload.data();
        },
        (error) => {
          console.log(error);
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

  updateEntry() {
    this.firebase.updateEntry(this.currentRaceId, this.currentEntryId, this.entry).then(
      () => {
        console.log('entry modified');
        this.location.back();
      }
    );
  }

  goBack() {
    this.location.back();
  }


}
