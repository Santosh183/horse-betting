import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { RaceListComponent } from './race-list/race-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import {RaceDetailsComponent} from './race-details/race-details.component';

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
    path: 'race/:id',
    component: RaceDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
