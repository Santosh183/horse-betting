import { Component, OnInit, OnDestroy } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  displayedColumns = ['user_no', 'name', 'balance', 'details'];
  sample: any[];
  dataSource: User[] ;
  subscriptions: any[] = [];
  constructor(private breakpointObserver: BreakpointObserver, private firebase: FirebaseService,
              private router: Router) { }

  ngOnInit() {
    const s = this.firebase.getUsers();
    this.subscriptions.push(s);
    s.subscribe(
      (users) => {
        this.dataSource = users.map(e => {
          return {
            user_no: e.payload.doc.data()[ 'userNumber'],
            name: e.payload.doc.data()[ 'userName'],
            balance: e.payload.doc.data()[ 'userBalance'],
            details: 'd'
          };
        });
      }
    );
    console.log(this.sample);
  }


  newUser() {
    this.router.navigate(['/newuser']);
  }

  ngOnDestroy() {
    for( let i = 0; i< this.subscriptions.length ; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }
}
export interface User {
  name: string;
  user_no: number;
  balance: number;
  details: string;
}

