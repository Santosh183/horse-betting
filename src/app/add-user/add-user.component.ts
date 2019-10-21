import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../firebase-service/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  user = {
    userNumber: null,
    userName: '',
    userBalance: null
  };
  subscriptions: any[] = [];
  errorMessage = '';
  constructor( private router: Router,
               private firebase: FirebaseService) { }
  ngOnInit() {
    this.errorMessage = '';
    this.user =  {
      userNumber: null,
      userName: '',
      userBalance: null
    };
  }
  addUser() {
    this.errorMessage = '';
    if (this.user.userNumber == null ||
       this.user.userBalance == null || this.user.userName === '') {
         this.errorMessage = 'field can not be empty';
    } else if ( this.user.userNumber <= 0 ) {
      this.errorMessage = 'User number can not be zero or negative';
    } else {
      let p =
      this.firebase.getUsers().subscribe(
        (users) => {
          this.errorMessage = '';
          if (users.length === 0) {
            this.firebase.addUser(this.user);
            this.router.navigate(['/userlist']);
          } else {
            for (let i = 0; i < users.length; i++) {
              if ( users[i].payload.doc.data()[ 'userNumber'] == this.user.userNumber) {
                this.errorMessage = 'user with this user number is already present';
              } else if (users.length - 1 === i) {
                if (this.errorMessage === '') {
                  this.firebase.addUser(this.user);
                  this.router.navigate(['/userlist']);
                }
              }
            }
          }

        },
        (error) => {
          console.log(error);
        }
      );
      this.subscriptions.push(p);
    }
  }
  goBack() {
    this.router.navigate(['/userlist']);
  }

  ngOnDestroy() {
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.subscriptions.length; i++ ) {

      this.subscriptions[i].unsubscribe();

    }
  }

}
