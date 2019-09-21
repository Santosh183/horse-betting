import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-race-details',
  templateUrl: './race-details.component.html',
  styleUrls: ['./race-details.component.scss']
})
export class RaceDetailsComponent implements OnInit {

  displayedColumns = ['rank', 'user_no', 'name', 'amount', 'details'];
  dataSource: Entry[] = [
    {rank: 1, entry_Seq: 1, user_no: 8,  name: 'Ram', amount: 13151 , details: 'd'},
    {rank: 2, entry_Seq: 1, user_no: 10, name: 'Shyam', amount: 4859, details: 'd'},
    {rank: 3, entry_Seq: 1, user_no: 14, name: 'Balu', amount: 7845, details: 'd'},
    {rank: 4, entry_Seq: 1, user_no: 12, name: 'Dhananjay', amount: 8657, details: 'd'},
    {rank: 5, entry_Seq: 1, user_no: 13, name: 'Shrusti', amount: 1351, details: 'd'},
  ];
  constructor() { }

  ngOnInit() {
  }

}

export interface Entry {
  rank: number;
  entry_Seq: number;
  user_no: number;
  name: string;
  amount: number;
  details: string;
}
