import { Component, OnInit, OnDestroy } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit, OnDestroy {

  subscriptions: any [] = [];
  users: any[] = [];
  myControl = new FormControl();
  filteredUsers: Observable<string[]>;
  bets: any[] = [
    'WINNER', 'PLACE', 'SHP', 'THP'
  ];
  currentRaceId: any;
  race: any = {
    raceHorses: null
  };
  showProcess = false;
  horses: number[] = [];
  errorFieldName = '';
  errorMessage = '';
  entry: any = {
    bettingType: 'WINNER',
    horseNumber: null,
    investedAmount: null,
    rank: null,
    rate: null,
    resultChange: null,
    taxRate: 5,
    userName: '',
    userNumber: null
  };
  constructor( private route: ActivatedRoute, private location: Location,
               private firebase: FirebaseService ) {}

  ngOnInit() {

    this.filteredUsers = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(
        value => {
          this.entry.userNumber = value;
          this.selectUser();
          return this._filter(value);
        }
      )
    );


    this.currentRaceId = this.route.snapshot.params.raceId;

    const s = this.firebase.getRace(this.currentRaceId);
    let t = s.subscribe(
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
    this.subscriptions.push(t);


    const u = this.firebase.getUsers();
    let p = u.subscribe(
      (users) => {
        this.users = users.map(e => {
          return {
            userId: e.payload.doc.id,
            userNumber: e.payload.doc.data()[ 'userNumber'],
            userName: e.payload.doc.data()[ 'userName'],
            userBalance: e.payload.doc.data()[ 'userBalance'],
          };
        });
      }
    );
    this.subscriptions.push(p);



  }

  private _filter(value: string): string[] {

    return this.users.filter(user => user.userNumber.toString().includes(value));
  }

  selectUser() {
    for(let i=0; i< this.users.length; i++) {

      if ( this.users[i].userNumber === this.entry.userNumber) {
        this.entry.userName = this.users[i].userName;
        break;
      } else {
        this.entry.userName = null;
      }
    }
  }

  fixDefaultTax() {
    if (this.entry.bettingType === 'SHP' || this.entry.bettingType === 'THP') {
      this.entry.taxRate = 0;
    }  else {
      this.entry.taxRate = 5;
    }
  }

  addEntry() {
    this.showProcess = true;
    this.errorFieldName = '';
    this.errorMessage = '';

    for(let i=0; i< this.users.length; i++) {

      if ( this.users[i].userNumber === this.entry.userNumber) {
        if (  this.users[i].userBalance < 0.85 * this.entry.investedAmount  ) {
            this.errorMessage = 'Insufficient Balance';
        }
      }
    }

    for ( const i in this.entry) {
      if (i !== 'rank' && i !== 'resultChange' ) {
        if (!this.entry[i] && this.entry[i] !== 0) {
          this.errorFieldName = i;
          this.errorMessage = this.errorFieldName + ' can not be empty';
          if (i === 'userName') {
            this.errorMessage = 'User with Number' + ' entered is not present';
          }
          if (i === 'rate' && (this.entry['bettingType'] === 'SHP' || this.entry['bettingType'] === 'THP')) {
            this.errorMessage = '';
          }

          break;
        }
      }
    }
    if (this.entry.investedAmount <= 0) {
      this.errorMessage = 'invested amount can not be less than 0';
    }
    if (this.entry.taxRate < 0) {
      this.errorMessage = 'tax rate can not be less than 0';
    }
    if (this.entry.rate < 0) {
      this.errorMessage = 'rate can not be less than 0';
    }

    if ( this.errorMessage === '') {
      this.firebase.addEntry(this.currentRaceId, this.entry).then(
        () => {
          console.log('added new entry to current race');
          let tempUser = this.users.find(
            (user) => {
              return user.userNumber === this.entry.userNumber;
            }
          );
          tempUser.userBalance = tempUser.userBalance -
           ( this.entry.investedAmount + ( this.entry.investedAmount *  this.entry.taxRate / 100 ) );
          const updatedUser = {
            userNumber: tempUser.userNumber,
            userName: tempUser.userName,
            userBalance: tempUser.userBalance
          };
          this.firebase.editUser( tempUser.userId, updatedUser).then(
            () => {
              console.log('balance updated for added user');
              this.showProcess = false;
              this.location.back();
            }
          );
        }
      );
    } else {
      this.showProcess = false;
    }

  }

  goBack() {
    this.location.back();
  }
  ngOnDestroy() {
    for( let i = 0; i< this.subscriptions.length ; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

}

