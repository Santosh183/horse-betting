import { Component, OnInit } from '@angular/core';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  user = {
    userNumber : 201,
    userName: 'Ram Kale',
    balance: 10000
  };


  constructor(public dialog: MatDialog, private router: Router) {}

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

  ngOnInit() {
  }

}
