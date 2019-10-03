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
  user = {
    userNumber : null,
    userName: '',
    balance: null
  };
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
  }
  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: {userNumber: this.user.userNumber}
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( result === true) {

        this.firebase.deleteUser(this.currentUserId).then(
          () => {
            this.router.navigate(['/userlist']);
          }
        );
       }
    });
  }
  navigateToEditUser() {
    this.router.navigate(['/edituser', this.user.userNumber]);
  }
  ngOnDestroy() {
    for( let i = 0; i< this.subscriptions.length ; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }


}
