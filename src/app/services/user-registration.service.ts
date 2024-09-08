import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {NewUser} from "../login/new-user";
import { Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){

  }

  register(newUser: NewUser): Observable<any> {
    return this.http.post<any>(this.apiUrl + "user-registration", newUser);
  }
}
