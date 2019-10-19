import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  signedIn = false;
  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    this.authService.signedInEvent.subscribe(
      (signedIn) => {
        this.signedIn = signedIn;
      }
    );
    this.authService.isSignedIn();
  }

  signOut() {
    this.authService.signOut().then(() => {
      localStorage.setItem('user', null);
      this.authService.isSignedIn();
      this.router.navigate(['signin']);
    });
  }

}
