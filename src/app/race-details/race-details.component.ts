import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CompleteRaceComponent } from '../complete-race/complete-race.component';
import { DeleteRaceComponent } from '../delete-race/delete-race.component';

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
  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
  }
  navigateToAddEntry() {
    this.router.navigate(['/race', 2, 'newentry']);
  }
  openCompleteDialog(): void {
    const dialogRefComplete = this.dialog.open(CompleteRaceComponent, {
      data: {}
    });

    dialogRefComplete.afterClosed().subscribe(result => {
      console.log(result); // return true on confirmation
    });
  }
  openDeleteDialog(): void {
    const dialogRefDelete = this.dialog.open(DeleteRaceComponent, {
      data: { } // pass some data of race so that we can delete correct race
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      console.log(result); // return true on confirmation
    });
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
