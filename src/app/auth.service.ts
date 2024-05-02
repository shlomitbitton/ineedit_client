import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NeedingEventService} from "./needing-event.service";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/'; // URL to web api
  constructor(private http: HttpClient,private router: Router, private needingEventService: NeedingEventService) { }


  authenticateUser(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}login`;
    console.info("User login attempt")
    const body = { username, password };
    return this.http.post<any>(url, body, { headers: { 'Content-Type': 'application/json' } })
      .pipe(
        switchMap(response => {
          console.log('Login successful', response);
          // Save the token locally for further authenticated requests
          localStorage.setItem('token', response.token);
          return this.needingEventService.getNeedingEventByUserId(response.userId).pipe(
            tap(events => {
              // Navigate to the user-specific page after fetching events
              this.router.navigate([`allNeedsByUser`], { queryParams: { userId: response.userId } })
                .then(() => console.log("Navigation successful!"))
                .catch(err => console.error("Navigation error: ", err)); // Handling navigation errors
            }),
            catchError(error => {
              console.error('Error fetching events', error);
              return of(null); // Handle errors within the stream
            })
          );
        }),
        catchError(error => {
          console.error('Login failed', error);
          return of(null); // Handle login failure
        })
      );
  }
}
