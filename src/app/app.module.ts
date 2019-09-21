import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserListComponent } from './user-list/user-list.component';
import { RaceListComponent } from './race-list/race-list.component';
import { MatTableModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,
         MatNativeDateModule, MatDialogModule, MatSelectModule, MatOptionModule } from '@angular/material';
import { UserDetailsComponent } from './user-details/user-details.component';
import { RaceDetailsComponent } from './race-details/race-details.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddRaceComponent } from './add-race/add-race.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { AddBalanceComponent } from './add-balance/add-balance.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { FormsModule } from '@angular/forms';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EntryDetailsComponent } from './entry-details/entry-details.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { DeleteEntryComponent } from './delete-entry/delete-entry.component';
import { DeleteRaceComponent } from './delete-race/delete-race.component';
import { EditRaceComponent } from './edit-race/edit-race.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    UserListComponent,
    RaceListComponent,
    UserDetailsComponent,
    RaceDetailsComponent,
    AddUserComponent,
    AddRaceComponent,
    DeleteUserComponent,
    AddBalanceComponent,
    ConfirmModalComponent,
    EditUserComponent,
    EntryDetailsComponent,
    EditEntryComponent,
    AddEntryComponent,
    DeleteEntryComponent,
    DeleteRaceComponent,
    EditRaceComponent,
  ],
  entryComponents: [
    DeleteUserComponent,
    AddBalanceComponent,
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
