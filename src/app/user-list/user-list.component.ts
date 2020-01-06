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
    let p = s.subscribe(
      (users) => {
        this.dataSource = users.map(e => {
          return {
            user_no: e.payload.doc.data()[ 'userNumber'],
            name: e.payload.doc.data()[ 'userName'],
            balance: e.payload.doc.data()[ 'userBalance'],
            details: 'd'
          };
        });
        this.dataSource.reverse();
      }
    );
    this.subscriptions.push(p);
    console.log(this.sample);
  }


  newUser() {
    this.router.navigate(['/newuser']);
  }
  copyUsers() {
      let val = '';
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0 ; i < this.dataSource.length; i++) {
        val = val + this.dataSource[i].user_no + ' # ' + this.dataSource[i].name + ' --->   ' + this.dataSource[i].balance + '\n';
      }
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
  }

  ngOnDestroy() {
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.subscriptions.length ; i++) {
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

