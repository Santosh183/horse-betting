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


  subscriptions: any[] = [];
  race: any = {
    raceNumber: null,
    raceWinners: [],
    raceHorses: null,
    raceDate: null,
    status: null,
    raceEntries: [ ]
  };
  currentRaceId: any = null;
  displayedColumns = ['rank', 'userNumber', 'userName', 'investedAmount', 'details'];

  constructor( public dialog: MatDialog, private route: ActivatedRoute,
               private router: Router, private firebase: FirebaseService ) {}

  ngOnInit() {
    this.currentRaceId = this.route.snapshot.params.raceId;
    const s = this.firebase.getRace(this.currentRaceId);
    this.subscriptions.push(s);
    s.subscribe(
      (race: any) => {

       console.log(race.payload.data());
       this.race.raceNumber = race.payload.data().raceNumber;
       this.race.raceWinners = race.payload.data().raceWinners;
       this.race.raceHorses = race.payload.data().raceHorses;
       this.race.status = race.payload.data().status;
       this.race.raceDate = this.convertToDate(race.payload.data().raceDate);

       const entries = this.firebase.getRaceEntries(this.currentRaceId);
       this.subscriptions.push(entries);
       entries.subscribe(
        (entry: any) => {
        this.race.raceEntries =  entry.map(e => {
            return {
              entryId: e.payload.doc.id,
              rank: e.payload.doc.data().rank,
              userNumber: e.payload.doc.data().userNumber,
              userName: e.payload.doc.data().userName,
              investedAmount: e.payload.doc.data().investedAmount,
              details: 'd'
            };
        });

        },
        (error) => {
          console.log(error);
        }
      );

      },
      (error) => {
        console.log(error);
      }
    );

  }

  convertToDate(timestamp: any) {
    let d =  new Date(timestamp.seconds * 1000);
    d = new Date(d.getTime() + Math.abs(d.getTimezoneOffset() * 60000));
    const temp = d.toISOString().slice(0, 10).split('-');
    return temp[2] + '-' + temp[1] + '-' + temp[0];
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

    dialogRefComplete.afterClosed().subscribe(result => {
      console.log(result); // return true on confirmation
    });
  }



  openDeleteDialog(): void {
    const dialogRefDelete = this.dialog.open(DeleteRaceComponent, {
      data: { } // pass some data of race so that we can delete correct race
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      console.log(result); // return true on confirmation
      if (result === true) {

        let flag = false;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.race.raceEntries.length ; i++) {
          this.firebase.deleteEntry(this.currentRaceId, this.race.raceEntries[i].entryId).then(
            () => {
              // below if condition really looks strange however it should work.
              // actually when we delete entry one by one component fetch updated entry data
              // from firebase as it's real time database and always in sync. although we get data
              // in ngOnInit that subscription remains there until we destroy the component.
              // hence when last entry get deleted that time our entries.length become zero
              if ( this.race.raceEntries.length === 0 ) {
                flag = true;
              }
            }
          );
        }
        if (flag) {
          this.firebase.deleteRace(this.currentRaceId).then(
            () => {
              this.router.navigate(['/racelist']);
            }
          );
        }
      }
    });
  }

  ngOnDestroy() {
    for( let i = 0; i< this.subscriptions.length ; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

}


