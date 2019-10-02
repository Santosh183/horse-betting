import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { RaceListComponent } from './race-list/race-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import {RaceDetailsComponent} from './race-details/race-details.component';
import { AddRaceComponent } from './add-race/add-race.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EntryDetailsComponent } from './entry-details/entry-details.component';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'userlist',
    pathMatch: 'full'
  },
  {
    path: 'userlist',
    component: UserListComponent
  },
  {
    path: 'racelist',
    component: RaceListComponent
  },
  {
    path: 'user/:id',
    component: UserDetailsComponent
  },
  {
    path: 'race/:raceId',
    component: RaceDetailsComponent
  },
  {
    path: 'newuser',
    component: AddUserComponent
  },
  {
    path: 'edituser/:id',
    component: EditUserComponent
  },
  {
    path: 'newrace',
    component: AddRaceComponent
  },
  {
    path: 'race/:raceId/entry/:entryId',
    component: EntryDetailsComponent
  },
  {
    path: 'race/:raceId/newentry',
    component: AddEntryComponent
  },
  {
    path: 'race/:raceId/entry/:entryId/edit',
    component: EditEntryComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
