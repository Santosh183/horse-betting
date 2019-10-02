import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';

@Component({
  selector: 'app-add-race',
  templateUrl: './add-race.component.html',
  styleUrls: ['./add-race.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddRaceComponent implements OnInit {

  constructor( private router: Router, private firebase: FirebaseService)  { }

  minDate = new Date();
  errorMessage = '';
  race: any = {
    raceDate: null,
    raceHorses: null,
    raceNumber: null,
    raceWinners: [],
    status: 'pending'
  };
  ngOnInit() {
    this.minDate = new Date();
  }
  addRace() {
    this.errorMessage = '';
    if (this.race.raceNumber == null ||
       this.race.raceDate == null || this.race.raceHorses === null) {
         this.errorMessage = 'field can not be empty';
    } else {
      this.firebase.getRaces().subscribe(
        (races) => {
          this.errorMessage = '';
          for (let i = 0; i < races.length; i++) {
            if ( races[i].payload.doc.data()[ 'raceNumber'] == this.race.raceNumber) {
              this.errorMessage = 'race with this race is already present';
            } else if (races.length - 1 === i) {
              if (this.errorMessage === '') {
                this.firebase.addRace(this.race);
                this.router.navigate(['/racelist']);
              }
            }
          }

        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  goBack() {
    this.router.navigate(['/racelist']);
  }

}
