import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {NewUser} from "../login/new-user";

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient){

  }

  register(newUser: NewUser) {

    this.http.post(this.apiUrl +"userRegistration", newUser).subscribe({
      next: (response) => {
        console.log('User registered successfully', response);
      },
      error: (error) => {
        console.error('Registration error', error);
      }
    });
  }
}
