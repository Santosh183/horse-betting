import { Component, OnInit } from '@angular/core';

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
export class UserListComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  displayedColumns = ['user_no', 'name', 'balance', 'details'];
  sample: any[];
  dataSource: User[] ; /*= [
    {user_no: 1, name: 'Ram', balance: 1000, details: 'd'},
    {user_no: 2, name: 'Shyam', balance: 4000, details: 'd'},
    {user_no: 3, name: 'Dnayneshwar', balance: 5000, details: 'd'},
    {user_no: 4, name: 'Santosh', balance: 5070, details: 'd'},
    {user_no: 5, name: 'Suresh', balance: 10000, details: 'd'},
  ];*/
  constructor(private breakpointObserver: BreakpointObserver, private firebase: FirebaseService,
              private router: Router) { }

  ngOnInit() {
    const s = this.firebase.getUsers();
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
}
export interface User {
  name: string;
  user_no: number;
  balance: number;
  details: string;
}

