import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NeedingEventService} from "./needing-event.service";
import { Router } from '@angular/router';
import {TokenStorageService} from "./services/token-storage.service";
import {production} from "../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = production.apiUrl;


  constructor(private http: HttpClient,private router: Router, private needingEventService: NeedingEventService,
              private tokenStorage: TokenStorageService) { }


  authenticateUser(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}login`;
    console.info("User login attempt")
    const body = { username, password };
    return this.http.post<any>(url, body, { headers: { 'Content-Type': 'application/json' } })
      .pipe(
        switchMap(response => {
          console.log('Login successful');
          // Save the token locally for further authenticated requests
          this.tokenStorage.saveToken(response.token);
          return this.needingEventService.getNeedingEventByUserId(response['user-id']).pipe(
            tap(events => {
              // Navigate to the user-specific page after fetching events
              this.router.navigate([`all-needs-by-user`], { queryParams: { 'user-id': response['user-id']}})
                .then(() => console.log("Navigation successful!"))
                .catch(err => console.error("Navigation error: ", err)); // Handling navigation errors
            }),
            catchError(error => {
              console.error('Error fetching events', error);
              return of({ error: 'Error fetching events' });
            })
          );
        }),
        catchError(error => {
          console.error('Login failed', error);
          return of({ error: 'Login failed. Please check your credentials and try again.' });
        })
      );
  }
}
