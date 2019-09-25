import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-race',
  templateUrl: './add-race.component.html',
  styleUrls: ['./add-race.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddRaceComponent implements OnInit {

  constructor(private location: Location) { }

  minDate = new Date();
  ngOnInit() {
    this.minDate = new Date();
  }
  goBack() {
    this.location.back();
  }

}
