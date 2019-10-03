import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase-service/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  user = {
    userNumber: null,
    userName: '',
    userBalance: null
  };
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
    } else {
      this.firebase.getUsers().subscribe(
        (users) => {
          this.errorMessage = '';
          if (users.length === 0) {
            this.firebase.addUser(this.user);
            this.router.navigate(['/userlist']);
          } else {
            for (let i = 0; i < users.length; i++) {
              if ( users[i].payload.doc.data()[ 'userNumber'] == this.user.userNumber) {
                this.errorMessage = 'user with this usernumber is already present';
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
    }
  }
  goBack() {
    this.router.navigate(['/userlist']);
  }


}
