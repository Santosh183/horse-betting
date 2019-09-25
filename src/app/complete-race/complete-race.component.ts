import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DeleteUserComponent, DialogData } from '../delete-user/delete-user.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-complete-race',
  templateUrl: './complete-race.component.html',
  styleUrls: ['./complete-race.component.scss']
})
export class CompleteRaceComponent implements OnInit {

  toppings = new FormControl();
  toppingList: string[] = ['1', '2', '3', '4', '5', '6', '7', '8'];
  horses: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8
  ];
  winners = {
    first: '',
    second: '',
    third: ''
  };
  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
