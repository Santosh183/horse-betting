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
import { AddBalanceComponent } from './add-balance/add-balance.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from './auth-guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'userlist',
    component: UserListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'racelist',
    component: RaceListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addbalance',
    component: AddBalanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/:id',
    component: UserDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'race/:raceId',
    component: RaceDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'newuser',
    component: AddUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edituser/:id',
    component: EditUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'newrace',
    component: AddRaceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'race/:raceId/entry/:entryId',
    component: EntryDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'race/:raceId/newentry',
    component: AddEntryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'race/:raceId/entry/:entryId/edit',
    component: EditEntryComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
