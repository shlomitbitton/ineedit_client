import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NeedingEventService} from "./needing-event.service";
import { Router } from '@angular/router';
import {TokenStorageService} from "./services/token-storage.service";
import {development} from "../environments/environment";
import {production} from "../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = production.apiUrl;
  private userIdSource = new BehaviorSubject<string | null>(null);

  // Observable to be consumed by other parts of the app
  userStatusChanges = this.userIdSource.asObservable();

  constructor(private http: HttpClient,private router: Router, private needingEventService: NeedingEventService,
              private tokenStorage: TokenStorageService) { }

  logout(): void {
    sessionStorage.removeItem('userId');
    this.userIdSource.next(null); // Emit null to indicate no user
  }

  getCurrentUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  login(userId: string): void {
    sessionStorage.setItem('userId', userId);
    console.log("userId in session: " )
    this.userIdSource.next(userId);
  }

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
          // Also save the userId to session storage
          sessionStorage.setItem('userId', response['user-id']);
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

  getUserPassword(email: string):  Observable<{ message: string, isError: boolean }>{
    const url = `${this.apiUrl}password-recovery`;
    const payload = {
      email: email
    };
    return this.http.post(url, payload).pipe(
      map(response => ({
        message: "Password recovery email sent successfully.",
        isError: false
      })),
      catchError(error => of({
        message: "An error occurred while trying to send the password recovery email. Please try again.",
        isError: true
      }))
    );
  }

  changeUserPassword(newPassword: string, token: string):  Observable<{ message: string, isError: boolean }>{
    const url = `${this.apiUrl}reset-password`;
    const payload = {
      token: token,
      newPassword: newPassword
    };
    return this.http.post(url, payload).pipe(
      map(response => ({
        message: "Password changed successfully.",
        isError: false
      })),
      catchError(error => of({
        message: "An error occurred while trying to change the password.",
        isError: true
      }))
    );
  }
}
