import { Component, OnInit } from '@angular/core';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  user = {
    userNumber : null,
    userName: '',
    balance: null
  };

  constructor(public dialog: MatDialog, private route: ActivatedRoute,
              private router: Router, private firebase: FirebaseService) {
  }
  /*
  ngOnInit() {
    this.user.userNumber = this.route.snapshot.params['id'];
    const s = this.firebase.getUsers();
    s.subscribe(
      (users) => {
        let temp: any;
        temp = users.filter(e => {
          return e.payload.doc.data()[ 'userNumber'] == this.user.userNumber;
        });
        this.user.userNumber = temp.payload.doc.data()[ 'userNumber'];
        this.user.userName = temp.payload.doc.data()[ 'userName'];
        this.user.balance = temp.payload.doc.data()[ 'userBalance'];
      }
    );
  } */
  ngOnInit() {
    this.user.userNumber = this.route.snapshot.params['id'];
    const s = this.firebase.getUser(this.user.userNumber);
    s.subscribe(
      (user: any) => {
       this.user =  user.map(e => {
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
  }
  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: {userNumber: this.user.userNumber, userName: this.user.userName, balance: this.user.balance}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result); // return true on confirmation
    });
  }
  navigateToEditUser() {
    this.router.navigate(['/edituser', this.user.userNumber]);
  }


}
