import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-add-race',
  templateUrl: './add-race.component.html',
  styleUrls: ['./add-race.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddRaceComponent implements OnInit {

  constructor() { }

  minDate = new Date();
  ngOnInit() {
    this.minDate = new Date();
  }

}
