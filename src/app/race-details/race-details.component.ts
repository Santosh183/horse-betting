import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CompleteRaceComponent } from '../complete-race/complete-race.component';
import { DeleteRaceComponent } from '../delete-race/delete-race.component';
import { FirebaseService } from '../firebase-service/firebase.service';

@Component({
  selector: 'app-race-details',
  templateUrl: './race-details.component.html',
  styleUrls: ['./race-details.component.scss']
})
export class RaceDetailsComponent implements OnInit, OnDestroy {


  flag = false;
  subscriptions: any[] = [];
  users: any[] = [];
  showThird = true;
  showSpinner = false;
  race: any = {
    raceNumber: null,
    raceWinners: [],
    cancelledHorses: [],
    SHP_rate: null,
    THP_rate: null,
    winnerDeduction: null,
    rankDeduction: null,
    raceHorses: null,
    raceDate: null,
    status: null,
    raceEntries: [ ]
  };
  currentRaceId: any = null;
  displayedColumns = [ 'userNumber', 'userName', 'horseNumber', 'investedAmount', 'rate', 'type','details'];

  constructor( public dialog: MatDialog, private route: ActivatedRoute,
               private router: Router, private firebase: FirebaseService ) {}

  ngOnInit() {
    this.showSpinner = true;
    this.currentRaceId = this.route.snapshot.params.raceId;
    const u = this.firebase.getUsers();
    // needed to get exact users whose entries are there so that we can update their balance after deleting race.
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
      }
    );
    this.subscriptions.push(a);

    const s = this.firebase.getRace(this.currentRaceId);
    let e = s.subscribe(
      (race: any) => {

       console.log(race.payload.data());
       if ( race.payload.data()) {
        this.race.raceNumber = race.payload.data().raceNumber;
        this.race.raceWinners = race.payload.data().raceWinners;
        this.race.raceHorses = race.payload.data().raceHorses;
        this.race.status = race.payload.data().status;
        this.race.raceDate = race.payload.data().raceDate;
        this.race.cancelledHorses =  race.payload.data().cancelledHorses ;
        this.race.SHP_rate = race.payload.data().SHP_rate ;
        this.race.THP_rate = race.payload.data().THP_rate ;
        this.race.winnerDeduction = race.payload.data().winnerDeduction ;
        this.race.rankDeduction = race.payload.data().rankDeduction ;
       }
       this.showThird = true;
       if (this.race.raceHorses - this.race.cancelledHorses.length < 8) {
        this.showThird = false;
       }

       const entries = this.firebase.getRaceEntries(this.currentRaceId);
       let b = entries.subscribe(
        (entry: any) => {
          this.race.raceEntries =  entry.map(e => {
              this.showSpinner = false;
              return {
                entryId: e.payload.doc.id,
                rank: e.payload.doc.data().rank,
                rate: e.payload.doc.data().rate,
                taxRate: e.payload.doc.data().taxRate,
                userNumber: e.payload.doc.data().userNumber,
                userName: e.payload.doc.data().userName,
                investedAmount: e.payload.doc.data().investedAmount,
                bettingType: e.payload.doc.data().bettingType,
                horseNumber: e.payload.doc.data().horseNumber,
                type: this.shortenBettingType(e.payload.doc.data().bettingType),
                details: 'd'
              };
          });
          this.race.raceEntries.reverse();

        },
        (error) => {
          console.log(error);
        }
      );
       this.subscriptions.push(b);

      },
      (error) => {
        console.log(error);
      }
    );
    this.subscriptions.push(e);
    this.showSpinner = false;


  }
  shortenBettingType(type: string) {
    if ( type === 'WINNER' ) {
      return 'W';
    }
    if ( type === 'PLACE' ) {
      return 'P';
    }
    if ( type === 'SHP' ) {
      return 'S';
    }
    if ( type === 'THP' ) {
      return 'T';
    }
  }

  convertToDate(timestamp: any) {
    if (timestamp) { // will not give null error
      let d =  new Date(timestamp.seconds * 1000);
      d = new Date(d.getTime() + Math.abs(d.getTimezoneOffset() * 60000));
      const temp = d.toISOString().slice(0, 10).split('-');
      return temp[2] + '-' + temp[1] + '-' + temp[0];
    }
  }

  navigateToAddEntry() {
    this.router.navigate(['/race', this.currentRaceId, 'newentry']);
  }

  openCompleteDialog(): void {
    const dialogRefComplete = this.dialog.open(CompleteRaceComponent, {
      data: {
        raceHorses: this.race.raceHorses
      }
    });

    let d = dialogRefComplete.afterClosed().subscribe(raceCompleteData => {
      console.log(raceCompleteData); // return true on confirmation


      if (raceCompleteData.confirmed === true) {

        this.race.raceWinners[0] = raceCompleteData.winners.first;
        this.race.raceWinners[1] = raceCompleteData.winners.second;
        this.race.raceWinners[2] = raceCompleteData.winners.third;

        this.race.cancelledHorses = [...raceCompleteData.cancelled];
        this.race.SHP_rate =  raceCompleteData.SHPRate;
        this.race.THP_rate =  raceCompleteData.THPRate;
        this.race.winnerDeduction = raceCompleteData.rankDeductionPercentage;
        this.race.rankDeduction = raceCompleteData.winnerDeductionPercentage;

        this.showSpinner = true;
        this.flag = false;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.race.raceEntries.length ; i++) {

          if (this.race.raceEntries[i].horseNumber === this.race.raceWinners[0]
              &&  ( this.race.raceEntries[i].bettingType === 'WINNER' || this.race.raceEntries[i].bettingType === 'PLACE') ) {

              this.processWinner( 1, i, raceCompleteData);

          } else if (this.race.raceEntries[i].horseNumber === this.race.raceWinners[1]
            &&  ( this.race.raceEntries[i].bettingType === 'SHP' || this.race.raceEntries[i].bettingType === 'PLACE') ) {

              this.processWinner( 2, i, raceCompleteData);

          } else  if (this.race.raceEntries[i].horseNumber === this.race.raceWinners[2] // .......
            &&  ( this.race.raceEntries[i].bettingType === 'THP' ||
             (this.race.raceEntries[i].bettingType === 'PLACE' &&
             (this.race.raceHorses - raceCompleteData.cancelled.length) >= 8) )
            ) {

              this.processWinner( 3, i, raceCompleteData);

          } else {

              this.processLoser(i, raceCompleteData);
          }

        }
        if (!this.flag) {
          this.race.status = 'completed';
          let tempObj = {...this.race};
          delete tempObj.raceEntries;
          this.firebase.updateRaceStatus(this.currentRaceId, tempObj).then(
            () => {
              this.showSpinner = false;
              this.router.navigate(['/racelist']);
            }
          );
        }
      }

    });
    this.subscriptions.push(d);
  }


  processWinner(rank: any, i: number, raceCompleteData: any) {

    if (this.race.raceEntries[i].bettingType === 'SHP') {
      this.race.raceEntries[i].rank = rank;
      this.race.raceEntries[i].resultChange = (this.race.raceEntries[i].investedAmount *  raceCompleteData.SHPRate)
        - (this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].taxRate / 100)
        - (this.race.raceEntries[i].investedAmount)
        ;

      let tempObject =   {...this.race.raceEntries[i]};
      delete tempObject.details;
      delete tempObject.entryId;
      this.firebase.updateEntry(this.currentRaceId, this.race.raceEntries[i].entryId , tempObject).then (
        () => {
          console.log('updated entry according to horse rank');
        }
      );
      let tempUser = this.users.find(
        (user) => {
          return user.userNumber === this.race.raceEntries[i].userNumber;
        }
      );
      tempUser.userBalance =
      tempUser.userBalance + ( this.race.raceEntries[i].investedAmount *  raceCompleteData.SHPRate );
      const updatedUser = {
        userNumber: tempUser.userNumber,
        userName: tempUser.userName,
        userBalance: tempUser.userBalance
      };
      this.firebase.editUser( tempUser.userId, updatedUser).then(
        () => {
          console.log('balance updated for rank holders of this entry');
          if ( i === this.race.raceEntries.length - 1 ) {
            this.race.status = 'completed';
            let tempObj = {...this.race};
            delete tempObj.raceEntries;
            this.firebase.updateRaceStatus(this.currentRaceId, tempObj).then(
              () => {
                console.log('race status updated');
                this.router.navigate(['/racelist']);
              }
            );
          }
        }
      );

    } else if (this.race.raceEntries[i].bettingType === 'THP') {

      this.race.raceEntries[i].rank = rank;
      this.race.raceEntries[i].resultChange = (this.race.raceEntries[i].investedAmount *  raceCompleteData.THPRate)
        - (this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].taxRate / 100)
        - (this.race.raceEntries[i].investedAmount);

      let tempObject =   {...this.race.raceEntries[i]};
      delete tempObject.details;
      delete tempObject.entryId;
      this.firebase.updateEntry(this.currentRaceId, this.race.raceEntries[i].entryId , tempObject).then (
        () => {
          console.log('updated entry according to horse rank');
        }
      );
      let tempUser = this.users.find(
        (user) => {
          return user.userNumber === this.race.raceEntries[i].userNumber;
        }
      );
      tempUser.userBalance =
      tempUser.userBalance + ( this.race.raceEntries[i].investedAmount *  raceCompleteData.THPRate );
      const updatedUser = {
        userNumber: tempUser.userNumber,
        userName: tempUser.userName,
        userBalance: tempUser.userBalance
      };
      this.firebase.editUser( tempUser.userId, updatedUser).then(
        () => {
          console.log('balance updated for rank holders of this entry');
          if ( i === this.race.raceEntries.length - 1 ) {
            this.race.status = 'completed';
            let tempObj = {...this.race};
            delete tempObj.raceEntries;
            this.firebase.updateRaceStatus(this.currentRaceId, tempObj).then(
              () => {
                console.log('race status updated');
                this.router.navigate(['/racelist']);
              }
            );
          }
        }
      );

    } else {

      this.race.raceEntries[i].rank = rank;
      this.race.raceEntries[i].resultChange = (this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].rate)
        - (this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].taxRate / 100);

      if (raceCompleteData.cancelled.length > 0) {
        if ( this.race.raceEntries[i].bettingType === 'WINNER') {
          this.race.raceEntries[i].resultChange = this.race.raceEntries[i].resultChange -
          (this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].rate) *
          (raceCompleteData.winnerDeductionPercentage / 100 );
        }
        if ( this.race.raceEntries[i].bettingType === 'PLACE') {
          this.race.raceEntries[i].resultChange = this.race.raceEntries[i].resultChange -
          (this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].rate) *
          (raceCompleteData.rankDeductionPercentage / 100 );
        }
      }

      let tempObject =   {...this.race.raceEntries[i]};
      delete tempObject.details;
      delete tempObject.entryId;
      this.firebase.updateEntry(this.currentRaceId, this.race.raceEntries[i].entryId , tempObject).then (
        () => {
          console.log('updated entry according to horse rank');
        }
      );
      let tempUser = this.users.find(
        (user) => {
          return user.userNumber === this.race.raceEntries[i].userNumber;
        }
      );
      tempUser.userBalance =
      tempUser.userBalance + this.race.raceEntries[i].investedAmount +
      ( this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].rate );
      if ( raceCompleteData.cancelled.length > 0) {
        if ( this.race.raceEntries[i].bettingType === 'PLACE' ) {
          tempUser.userBalance = tempUser.userBalance - (raceCompleteData.rankDeductionPercentage / 100) *
          ( this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].rate ) ;
        }
        if ( this.race.raceEntries[i].bettingType === 'WINNER' ) {

          tempUser.userBalance = tempUser.userBalance - (raceCompleteData.winnerDeductionPercentage / 100) *
          ( this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].rate ) ;
        }
      }
      const updatedUser = {
        userNumber: tempUser.userNumber,
        userName: tempUser.userName,
        userBalance: tempUser.userBalance
      };
      this.firebase.editUser( tempUser.userId, updatedUser).then(
        () => {
          console.log('balance updated for rank holders of this entry');
          if ( i === this.race.raceEntries.length - 1 ) {
            this.race.status = 'completed';
            let tempObj = {...this.race};
            delete tempObj.raceEntries;
            this.firebase.updateRaceStatus(this.currentRaceId, tempObj).then(
              () => {
                console.log('race status updated');
                this.router.navigate(['/racelist']);
              }
            );
          }
        }
      );

    }

  }

  processLoser( i: number, raceCompleteData: any) {

    if ( raceCompleteData.cancelled.indexOf(this.race.raceEntries[i].horseNumber) >= 0 ) {

      this.race.raceEntries[i].resultChange = 0;
      let tempObject =   {...this.race.raceEntries[i]};
      delete tempObject.details;
      delete tempObject.entryId;
      this.firebase.updateEntry(this.currentRaceId, this.race.raceEntries[i].entryId , tempObject).then (
        () => {
          console.log('updated entry according to horse rank');
        }
      );

      let tempUser = this.users.find(
        (user) => {
          return user.userNumber === this.race.raceEntries[i].userNumber;
        }
      );
      tempUser.userBalance = tempUser.userBalance + this.race.raceEntries[i].investedAmount +
       ( this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].taxRate / 100 );
      const updatedUser = {
        userNumber: tempUser.userNumber,
        userName: tempUser.userName,
        userBalance: tempUser.userBalance
      };
      this.firebase.editUser( tempUser.userId, updatedUser).then(
        () => {
          console.log('balance updated for rank holders of this entry');
          if ( i === this.race.raceEntries.length - 1 ) {
            this.race.status = 'completed';
            let tempObj = {...this.race};
            delete tempObj.raceEntries;
            this.flag = true;
            this.firebase.updateRaceStatus(this.currentRaceId, tempObj).then(
              () => {
                console.log('race status updated');
                this.router.navigate(['/racelist']);
              }
            );
          }
        }
      );

    } else {
      this.race.raceEntries[i].resultChange = -(this.race.raceEntries[i].investedAmount +
        this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].taxRate / 100);
      let tempObject =   {...this.race.raceEntries[i]};
      delete tempObject.details;
      delete tempObject.entryId;
      this.firebase.updateEntry(this.currentRaceId, this.race.raceEntries[i].entryId , this.race.raceEntries[i]).then (
        () => {
          console.log('updated entry according to horse rank');
          if ( i === this.race.raceEntries.length - 1 ) {
            this.race.status = 'completed';
            let tempObj = {...this.race};
            delete tempObj.raceEntries;
            this.flag = true;
            this.firebase.updateRaceStatus(this.currentRaceId, tempObj).then(
              () => {
                console.log('race status updated');
                this.router.navigate(['/racelist']);
              }
            );
          }
        }
      );
    }

  }

  openDeleteDialog(): void {
    const dialogRefDelete = this.dialog.open(DeleteRaceComponent, {
      data: { } // pass some data of race so that we can delete correct race
    });

    let o = dialogRefDelete.afterClosed().subscribe(result => {
      console.log(result); // return true on confirmation
      if (result === true) {

        this.showSpinner = true;
        let flag = false; // to identify it race has entries or not so that we will not end up trying to delete race twice
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.race.raceEntries.length ; i++) {

          flag = true;
          if ( this.race.status === 'pending') {

            let tempUser = this.users.find(
              (user) => {
                return user.userNumber === this.race.raceEntries[i].userNumber;
              }
            );
            tempUser.userBalance =
            tempUser.userBalance + ( this.race.raceEntries[i].investedAmount +
            ( this.race.raceEntries[i].investedAmount *  this.race.raceEntries[i].taxRate / 100 ) );
            const updatedUser = {
              userNumber: tempUser.userNumber,
              userName: tempUser.userName,
              userBalance: tempUser.userBalance
            };
            this.firebase.editUser( tempUser.userId, updatedUser).then(
              () => {
                console.log('balance updated for updated user of this entry');
              }
            );

          }
          this.firebase.deleteEntry(this.currentRaceId, this.race.raceEntries[i].entryId).then(
            () => {
              // below if condition really looks strange however it should work.
              // actually when we delete entry one by one component fetch updated entry data
              // from firebase as it's real time database and always in sync. although we get data
              // in ngOnInit that subscription remains there until we destroy the component.
              // hence when last entry get deleted that time our entries.length become zero
              if ( this.race.raceEntries.length === 0 ) {
                this.firebase.deleteRace(this.currentRaceId).then(
                  () => {
                    this.showSpinner = false;
                    this.router.navigate(['/racelist']);
                  }
                );
              }
            }
          );
        }
        if ( !flag) {
          this.firebase.deleteRace(this.currentRaceId).then(
            () => {
              this.showSpinner = false;
              this.router.navigate(['/racelist']);
            }
          );
        }
      }
    });
    this.subscriptions.push(o);
  }

  ngOnDestroy() {
    for( let i = 0; i< this.subscriptions.length ; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

}


