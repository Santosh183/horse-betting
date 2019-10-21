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
        let now = new Date().getTime();
        localStorage.setItem( 'user', JSON.stringify({ value: JSON.stringify(this.userData), timestamp: now}));
        if ( localStorage.getItem('user') !== '') {
          JSON.parse(localStorage.getItem('user'));
        }
      } else {
        localStorage.setItem('user', '');
        if ( localStorage.getItem('user') !== '') {
          JSON.parse(localStorage.getItem('user'));
        }
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

    if ( localStorage.getItem('user') !== '' ) {
      const token = JSON.parse(localStorage.getItem('user'));
      let now = new Date().getTime();
      let temp = (now - token.timestamp) < 600000;
      this.signedInEvent.emit((token !== ''  && temp) ? true : false);
    } else {
      this.signedInEvent.emit(false);
    }


  }

}
