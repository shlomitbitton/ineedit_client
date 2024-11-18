import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {NeedingEventService} from "./needing-event.service";
import { Router } from '@angular/router';
import {TokenStorageService} from "./services/token-storage.service";
import {environment} from "../environments/environment";
import {UserResponseDto} from "./models/UserResponseDto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = environment.apiUrl;
  private userIdSource = new BehaviorSubject<string | null>(null);

  userStatusChanges = this.userIdSource.asObservable();

  constructor(private http: HttpClient,private router: Router, private needingEventService: NeedingEventService,
              private tokenStorage: TokenStorageService) { }

  logout(): void {
    sessionStorage.removeItem('userId');
    this.userIdSource.next(null);
  }

  getCurrentUserId(): string | null {
    return sessionStorage.getItem('userId');
  }


  getCurrentUserEmail(): Observable<string>{
    const userId = this.getCurrentUserId();
        if (userId) {
          // const params = new HttpParams().set('user-id', userId);
        const userDetails = this.http.get<UserResponseDto>(`${this.apiUrl}user-details`);
        return userDetails.pipe(
          map(response => response.userEmail),
          catchError(error => {
            console.error('Error fetching user email:', error);
            return of('');
          })
        );
    } else {
        // Return an observable with an empty string if userId is not found
          return new Observable<string>(observer => {
            observer.next('');
            observer.complete();
          });
        }
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
          return this.needingEventService.getNeedingEventByUserId().pipe(
            tap(events => {
              // Navigate to the user-specific page after fetching events
              this.router.navigate([`all-needs-by-user`])
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
