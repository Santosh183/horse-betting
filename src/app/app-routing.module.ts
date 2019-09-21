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
    path: 'race/:raceNumber',
    component: RaceDetailsComponent
  },
  {
    path: 'newuser',
    component: AddUserComponent
  },
  {
    path: 'edituser/:userNumber',
    component: EditUserComponent
  },
  {
    path: 'newrace',
    component: AddRaceComponent
  },
  {
    path: 'race/:raceNumber/entry/:entry_seq',
    component: EntryDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
