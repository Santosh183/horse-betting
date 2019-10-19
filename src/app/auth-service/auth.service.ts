import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  userData: any;
  signedInEvent: EventEmitter<boolean> = new EventEmitter();

  constructor( public afAuth: AngularFireAuth, public router: Router,     public ngZone: NgZone) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });

  }

  signIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  signOut() {
    return this.afAuth.auth.signOut();
    // .then(() => {
    //   localStorage.removeItem('user');
    //   this.router.navigate(['sign-in']);
    // })
  }

  isSignedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.signedInEvent.emit((user !== null ) ? true : false);
  }

}
