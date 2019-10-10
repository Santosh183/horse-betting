import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-balance',
  templateUrl: './add-balance.component.html',
  styleUrls: ['./add-balance.component.scss']
})
export class AddBalanceComponent implements OnInit {

  user = {
    userId: null,
    userNumber: null,
    userName: '',
    userBalance: null
  };
  balance: number = null;
  users: any[] = [];
  myControl = new FormControl();
  filteredUsers: Observable<string[]>;
  errorMessage = '';
  constructor( private router: Router,
               private firebase: FirebaseService) { }
  ngOnInit() {
    this.filteredUsers = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(
        value => {
          this.user.userNumber = value;
          this.selectUser();
          return this._filter(value);
        }
      )
    );
    this.errorMessage = '';
    this.user =  {
      userId: null,
      userNumber: null,
      userName: '',
      userBalance: null
    };
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
  }

  private _filter(value: string): string[] {

    return this.users.filter(user => user.userNumber.toString().includes(value));
  }



  selectUser() {
    for(let i=0; i< this.users.length; i++) {

      if ( this.users[i].userNumber === this.user.userNumber) {
        this.user.userName = this.users[i].userName;
        this.user.userId = this.users[i].userId;
        this.user.userBalance = this.users[i].userBalance;
        break;
      } else {
        this.user.userName = null;
      }
    }
  }

  addBalance() {
    this.errorMessage = '';
    if (this.user.userName == null ||
       this.user.userBalance == null || this.user.userName === '') {
         this.errorMessage = 'field can not be empty';
    } else {
      this.firebase.editUser(this.user.userId, {
        userNumber: this.user.userNumber,
        userName: this.user.userName,
        userBalance: this.user.userBalance + this.balance
      }).then(
        () => {
          console.log('added balance for requested user');
          this.router.navigate(['/userlist']);
        }
      );
    }
  }
  goBack() {
    this.router.navigate(['/userlist']);
  }


}

