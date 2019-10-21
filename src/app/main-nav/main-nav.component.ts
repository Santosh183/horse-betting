import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class MainNavComponent implements OnInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  signedIn = false;
  subscriptions: any[] = [];
  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    let p =
    this.authService.signedInEvent.subscribe(
      (signedIn) => {
        this.signedIn = signedIn;
      }
    );
    this.subscriptions.push(p);
    this.authService.isSignedIn();
  }

  signOut() {
    this.authService.signOut().then(() => {
      localStorage.setItem('user', '');
      this.authService.isSignedIn();
      this.router.navigate(['signin']);
    });
  }

  ngOnDestroy() {
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.subscriptions.length; i++ ) {

      this.subscriptions[i].unsubscribe();

    }
  }

}
