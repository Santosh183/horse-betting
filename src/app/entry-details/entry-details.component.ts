import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { MatDialog } from '@angular/material';
import { DeleteEntryComponent } from '../delete-entry/delete-entry.component';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  constructor(private router: Router, private location: Location,
              public matdialog: MatDialog) { }

  ngOnInit() {
  }
  navigateToEditEntry() {
    this.router.navigate(['/race', 5, 'entry', 3, 'edit']);
  }
  backToEnrtries() {
    this.location.back();
  }
  openDeleteDialog(): void {
    const dialogRefDelete = this.matdialog.open(DeleteEntryComponent, {
      data: { } // pass some data of race so that we can delete correct entry
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      console.log(result); // return true on confirmation
    });
  }

}
