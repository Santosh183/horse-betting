import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  subscriptions: any[] = [];
  showSpinner = false;
  user = {
    userNumber : null,
    userName: '',
    balance: null
  };
  races: any[] = [];
  currentUserId: any;
  constructor(public dialog: MatDialog, private route: ActivatedRoute,
              private router: Router, private firebase: FirebaseService) {
  }

  ngOnInit() {
    this.user.userNumber = this.route.snapshot.params['id'];
    this.currentUserId = null;
    const s = this.firebase.getUser(this.user.userNumber);
    let p = s.subscribe(
      (user: any) => {
       this.user =  user.map(e => {
          this.currentUserId = e.payload.doc.id;
          return {
            userNumber: e.payload.doc.data()[ 'userNumber'],
            userName: e.payload.doc.data()[ 'userName'],
            balance: e.payload.doc.data()[ 'userBalance']
          };
       })[0];

      },
      (error) => {
        console.log(error);
      }
    );
    this.subscriptions.push(p);

    const x = this.firebase.getRaces();
    let f = x.subscribe(
    (races) => {
      this.races = races.map(e => {
            return {
              raceId: e.payload.doc.id,
              raceHorses: e.payload.doc.data()[ 'raceHorses'],
              raceNumber: e.payload.doc.data()[ 'raceNumber'],
              raceDate: e.payload.doc.data()[ 'raceDate'],
              status: e.payload.doc.data()[ 'status'],
              details: 'd'
            };
        });
      }
    );
    this.subscriptions.push(f);

  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: {userNumber: this.user.userNumber}
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( result === true) {

        this.showSpinner = true;
        // tslint:disable-next-line:prefer-for-of
        for ( let i = 0; i < this.races.length; i++) {
          this.firebase.getRaceEntries(this.races[i].raceId).subscribe(
            (entry) => {
              let tempEntry: any[] =  entry.map(e => {

                    return {
                      entryId: e.payload.doc.id,
                      rank: e.payload.doc.data().rank,
                      rate: e.payload.doc.data().rate,
                      taxRate: e.payload.doc.data().taxRate,
                      userNumber: e.payload.doc.data().userNumber,
                      userName: e.payload.doc.data().userName,
                      investedAmount: e.payload.doc.data().investedAmount,
                      bettingType: e.payload.doc.data().bettingType,
                      horseNumber: e.payload.doc.data().horseNumber
                    };
              });

              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < tempEntry.length; j++) {
                if (this.user.userNumber === tempEntry[j].userNumber) {
                  this.firebase.deleteEntry(this.races[i].raceId, tempEntry[j].entryId).then(
                    () => {
                    }
                  );
                }
              }
              if ( i === this.races.length - 1 ) {
                this.firebase.deleteUser(this.currentUserId).then(
                  () => {
                    this.showSpinner = false;
                    this.router.navigate(['/userlist']);
                  }
                );
              }

            },
            (error) => {
              console.log(error);
            }
          );
        }
      }
    });
  }


  navigateToEditUser() {
    this.router.navigate(['/edituser', this.user.userNumber]);
  }


  ngOnDestroy() {
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.subscriptions.length ; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }


}
