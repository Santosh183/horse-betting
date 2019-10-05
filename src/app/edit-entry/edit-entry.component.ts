import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss']
})
export class EditEntryComponent implements OnInit, OnDestroy {

  subscriptions: any[] = [];
  users: any[] = [];
  bets: any[] = [
     'SHP', 'THP', 'RANK', 'WINNER'
  ];
  currentRaceId: any;
  currentEntryId: any;
  race: any = {
    raceHorses: null
  };
  userInfoBeforeEditing: any = {
    investedAmount: null,
    taxRate: null
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
    let p = s.subscribe(
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
    this.subscriptions.push(p);


    const entries = this.firebase.getEntryDetails(this.currentRaceId, this.currentEntryId );
    entries.subscribe(
        (entry: any) => {

          console.log(entry.payload.data());
          this.entry =  entry.payload.data();
          const u = this.firebase.getUsers();
          let tempUser = null;
          let a = u.subscribe(
            (users) => {
              this.users = users.map(e => {
                return {
                  userId: e.payload.doc.id,
                  userNumber: e.payload.doc.data()[ 'userNumber'],
                  userName: e.payload.doc.data()[ 'userName'],
                  userBalance: e.payload.doc.data()[ 'userBalance'],
                };
              });
              tempUser = this.users.find(
                (user) => {
                  return user.userNumber === this.entry.userNumber;
                }
              );
              this.userInfoBeforeEditing.investedAmount = this.entry.investedAmount;
              // require when we update user first we need to credit their balance first with past deduction
              this.userInfoBeforeEditing.taxRate = this.entry.taxRate;
            }
          );
          this.subscriptions.push(a);

        },
        (error) => {
          console.log(error);
        }
      );
  }


  updateEntry() {
    let tempUser = this.users.find(
      (user) => {
        return user.userNumber === this.entry.userNumber;
      }
    );
    tempUser.userBalance = tempUser.userBalance + ( this.userInfoBeforeEditing.investedAmount
       + ( this.userInfoBeforeEditing.investedAmount *  this.userInfoBeforeEditing.taxRate / 100 ) );
    tempUser.userBalance = tempUser.userBalance - ( this.entry.investedAmount + ( this.entry.investedAmount *  this.entry.taxRate / 100 ) );
    const updatedUser = {
      userNumber: tempUser.userNumber,
      userName: tempUser.userName,
      userBalance: tempUser.userBalance
    };
    this.firebase.editUser( tempUser.userId, updatedUser).then(
      () => {
        console.log('balance updated for updated user of this entry');
        this.firebase.updateEntry(this.currentRaceId, this.currentEntryId, this.entry).then(
          () => {
            console.log('entry modified');
            this.location.back();
          }
        );
      }
    );
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
