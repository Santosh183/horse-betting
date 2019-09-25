import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit {

  users: User[] = [
    {
      userNumber: 201,
      userName: 'Santosh'
    },
    {
      userNumber: 231,
      userName: 'Suresh'
    }
  ];
  bets: any[] = [
    'FHP', 'SHP', 'THP', 'RANK', 'WINNER'
  ];
  horses: number[] = [1, 2, 3, 4, 5, 6, 7, 8]; // this array shoud be generated automatically from total horses.
  constructor(private location: Location) { }

  ngOnInit() {
  }
  goBack() {
    this.location.back();
  }

}

interface User {
  userNumber: number;
  userName: string;
}
