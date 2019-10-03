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

  raceFinishData: any = {
    winners: {
      first: null,
      second: null,
      third: null
    },
    cancelled: [],
    rankDeductionPercentage: null,
    winnerDeductionPercentage: null

  };
  horses: number[] = [];
  constructor(
    public dialogRef: MatDialogRef<CompleteRaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    console.log(this.data);
    for ( let i = 1; i <= this.data["raceHorses"]; i++) {
      this.horses.push(i);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  returnHorses(flag: any) {
    if ( flag === 'first') {
        return this.horses.filter(
          (horse) => {
            return horse !== null;
          }
        );
    }
    if ( flag === 'second') {
      return this.horses.filter(
        (horse) => {
          return horse !== this.raceFinishData.winners.first;
        }
      );
    }
    if ( flag === 'third') {
      return this.horses.filter(
        (horse) => {
          return ( horse !== this.raceFinishData.winners.first && horse !== this.raceFinishData.winners.second);
        }
      );
    }
  }

}
