import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { MatDialog } from '@angular/material';
import { DeleteEntryComponent } from '../delete-entry/delete-entry.component';
import { FirebaseService } from '../firebase-service/firebase.service';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit, OnDestroy {

  subscriptions: any[] = [];
  users: any[] = [];
  entry: any = {

  };
  race: any = {

  };
  currentRaceId: any;
  currentEntryId: any;
  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
              private firebase: FirebaseService, public matdialog: MatDialog) { }

  ngOnInit() {
    this.currentRaceId = this.route.snapshot.params.raceId;
    this.currentEntryId = this.route.snapshot.params.entryId;

    let p = this.firebase.getRace(this.currentRaceId).subscribe(
      (race) => {
        this.race.status = race.payload.data()["status"];
      }
    );
    this.subscriptions.push(p);


    const u = this.firebase.getUsers(); // needed to get exact user which we want to delete
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

    const entries = this.firebase.getEntryDetails(this.currentRaceId, this.currentEntryId );
    let e = entries.subscribe(
        (entry: any) => {

          console.log(entry.payload.data());
          this.entry =  entry.payload.data();
        },
        (error) => {
          console.log(error);
        }
      );
    this.subscriptions.push(e);
  }
  navigateToEditEntry() {
    this.router.navigate(['/race', this.currentRaceId, 'entry', this.currentEntryId, 'edit']);
  }
  backToEnrtries() {
    this.location.back();
  }

  openDeleteDialog(): void {
    const dialogRefDelete = this.matdialog.open(DeleteEntryComponent, {
      data: { } // pass some data of race so that we can delete correct entry
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      console.log(result); // return true on confirmation
      if ( result === true) {
        this.deleteEntry();
      }
    });
  }
  deleteEntry() {
    let tempUser = this.users.find(
      (user) => {
        return user.userNumber === this.entry.userNumber;
      }
    );
    tempUser.userBalance = tempUser.userBalance + ( this.entry.investedAmount + ( this.entry.investedAmount *  this.entry.taxRate / 100 ) );
    const updatedUser = {
      userNumber: tempUser.userNumber,
      userName: tempUser.userName,
      userBalance: tempUser.userBalance
    };
    this.firebase.editUser( tempUser.userId, updatedUser).then(
      () => {
        console.log('balance updated for updated user of this entry');
        this.firebase.deleteEntry(this.currentRaceId, this.currentEntryId).then(
          () => {
            console.log('entry deleted');
            this.location.back();
          }
        );
      }
    );
  }

  ngOnDestroy() {
    for( let i = 0; i< this.subscriptions.length ; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

}
