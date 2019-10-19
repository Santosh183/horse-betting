import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { Router } from '@angular/router';

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
  constructor(private authService: AuthService, public ngZone: NgZone,
              private  router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.signIn(this.loginData.email, this.loginData.password).then((result) => {
      this.ngZone.run(() => {
        this.authService.isSignedIn();
        this.router.navigate(['userlist']);
      });
    }).catch((error) => {
      this.errorMessage = error.message;
      localStorage.setItem('user', null);
    });
  }

}
