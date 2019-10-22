import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginData = {
    email: '',
    password: ''
  };
  errorMessage = '';
  signedIn = false;
  constructor(private authService: AuthService, public ngZone: NgZone, public afAuth: AngularFireAuth,
              private  router: Router) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // this.userData = user;
        let now = new Date().getTime();
        localStorage.setItem( 'user', JSON.stringify({ value: JSON.stringify(user), timestamp: now}));
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

    let p =
    this.authService.signedInEvent.subscribe(
      (signedIn) => {
        this.signedIn = signedIn;
      }
    );

  }

  ngOnInit() {
    this.authService.isSignedIn();

  }

  login() {
    if (this.signedIn) {
      this.authService.signOut().then(
        () => {
          this.authService.signIn(this.loginData.email, this.loginData.password).then((result) => {
            this.ngZone.run(() => {
              this.authService.isSignedIn();
              this.router.navigate(['userlist']);
            });
          }).catch((error) => {
            this.errorMessage = error.message;
            localStorage.setItem('user', '');
            this.authService.isSignedIn();
          });
        }
      );
    } else {
      this.authService.signIn(this.loginData.email, this.loginData.password).then((result) => {
        this.ngZone.run(() => {
          this.authService.isSignedIn();
          this.router.navigate(['userlist']);
        });
      }).catch((error) => {
        this.errorMessage = error.message;
        localStorage.setItem('user', '');
        this.authService.isSignedIn();
      });
    }
  }

}
