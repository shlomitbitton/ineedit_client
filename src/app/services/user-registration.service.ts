import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {NewUser} from "../login/new-user";
import {catchError, Observable, of, switchMap, tap} from "rxjs";
import {TokenStorageService} from "./token-storage.service";
import {Router} from "@angular/router";
import {NeedingEventService} from "../needing-event.service";

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private router: Router, private needingEventService: NeedingEventService){

  }

  register(newUser: NewUser): Observable<any> {
    return this.http.post<any>(this.apiUrl + "user-registration", newUser);
    //   tap(response => {
    //     console.log('Registration successful', response);
    //     // Navigate to the login page after a successful registration
    //     this.router.navigate([`login`])
    //       .then(() => console.log("Navigation to login page successful!"))
    //       .catch(err => console.error("Navigation error: ", err)); // Handling navigation errors
    //   }),
    //   catchError(error => {
    //     console.error('Error during registration', error);
    //     return of({ error: 'Error during registration' });
    //   })
    // );
  }
}
