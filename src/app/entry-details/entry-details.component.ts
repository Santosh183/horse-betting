import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { MatDialog } from '@angular/material';
import { DeleteEntryComponent } from '../delete-entry/delete-entry.component';
import { FirebaseService } from '../firebase-service/firebase.service';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  entry: any = {

  };
  currentRaceId: any;
  currentEntryId: any;
  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
              private firebase: FirebaseService, public matdialog: MatDialog) { }

  ngOnInit() {
    this.currentRaceId = this.route.snapshot.params.raceId;
    this.currentEntryId = this.route.snapshot.params.entryId;
    const entries = this.firebase.getEntryDetails(this.currentRaceId, this.currentEntryId );
    entries.subscribe(
        (entry: any) => {

          console.log(entry.payload.data());
          this.entry =  entry.payload.data();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  navigateToEditEntry() {
    this.router.navigate(['/race', this.currentRaceId, 'entry', this.currentEntryId, 'edit']);
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
