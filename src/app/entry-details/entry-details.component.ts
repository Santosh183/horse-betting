import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
  }
  navigateToEditEntry() {
    this.router.navigate(['/race', 5, 'entry', 3, 'edit']);
  }
  backToEnrtries() {
    this.location.back();
  }

}
