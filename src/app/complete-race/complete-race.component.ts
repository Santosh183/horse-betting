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
    winnerDeductionPercentage: null,
    confirmed: false

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

  toggleButton() {
    if ( this.raceFinishData.winners.first !== null && this.raceFinishData.winners.second !== null &&
         this.raceFinishData.winners.third !== null ) {
          this.raceFinishData.confirmed = true;
        }

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
    if ( flag === 'cancelled') {
      return this.horses.filter(
        (horse) => {
          return ( horse !== this.raceFinishData.winners.first && horse !== this.raceFinishData.winners.second
                   && horse !== this.raceFinishData.winners.third);
        }
      );
    }
  }

}
