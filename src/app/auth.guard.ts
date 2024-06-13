import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from './services/token-storage.service';
import {catchError, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenStorageService: TokenStorageService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if the user is logged in (i.e., a token is available)
    const token = this.tokenStorageService.getToken();

    if (token && sessionStorage.getItem('userId') !== null)  {
      // Token exists, allow access to the route
      return true;
    } else {
      // No token found, redirect to the public needs page
      this.router.navigate([`/public-needs`], { queryParams: {returnUrl: state.url  } })
        .then(() => console.log("Navigation successful!"))
        .catch(err => console.error("Navigation error: ", err)), // Handling navigation errors
      catchError(error => {
        console.error('Error fetching events', error);
        return of(null); // Handle errors within the stream
      })
      return false;
    }
  }
}
