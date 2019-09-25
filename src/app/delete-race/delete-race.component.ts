import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DeleteUserComponent } from '../delete-user/delete-user.component';

@Component({
  selector: 'app-delete-race',
  templateUrl: './delete-race.component.html',
  styleUrls: ['./delete-race.component.scss']
})
export class DeleteRaceComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
export interface DialogData {
  animal: string;
  name: string;
}
