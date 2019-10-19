import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  signedIn = false;
  constructor(private authService: AuthService, private router: Router) {

    this.authService.signedInEvent.subscribe(
      ( signedIn) => {
        this.signedIn = signedIn;
      }
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.authService.isSignedIn();
    if (this.signedIn !== true) {
      this.router.navigate(['signin']);
    }
    return true;
  }

}
