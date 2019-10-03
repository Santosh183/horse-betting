import { Component, OnInit, OnDestroy } from '@angular/core';
import {Location} from '@angular/common';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  subscriptions: any[] = [];
  user = {
    userNumber : null,
    userName: '',
    userBalance: null
  };
  currentUserId: any = null;

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private location: Location, 
              private router: Router, private firebase: FirebaseService) {
  }

  ngOnInit() {
    this.user.userNumber = this.route.snapshot.params['id'];
    this.currentUserId = null;
    const s = this.firebase.getUser(this.user.userNumber);
    s.subscribe(
      (user: any) => {
       this.user =  user.map(e => {
          this.currentUserId = e.payload.doc.id;
          return {
            userNumber: e.payload.doc.data()[ 'userNumber'],
            userName: e.payload.doc.data()[ 'userName'],
            userBalance: e.payload.doc.data()[ 'userBalance']
          };
       })[0];

      },
      (error) => {
        console.log(error);
      }
    );
  }
  goBack() {
    this.location.back();
  }
  editUser() {
    this.firebase.editUser(this.currentUserId, this.user).then(
      (res) => {
        console.log(res + 'updated');
        this.router.navigate(['/userlist']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    for( let i = 0; i< this.subscriptions.length ; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

}
