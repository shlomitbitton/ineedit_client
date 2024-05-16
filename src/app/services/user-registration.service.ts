import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {NewUser} from "../login/new-user";
import {catchError, Observable, of, switchMap, tap} from "rxjs";
import {TokenStorageService} from "./token-storage.service";
import {Router} from "@angular/router";
import {NeedingEventService} from "../needing-event.service";
import {production} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  private apiUrl = production.apiUrl;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private router: Router, private needingEventService: NeedingEventService){

  }

  register(newUser: NewUser): Observable<any> {
    return this.http.post<any>(this.apiUrl + "user-registration", newUser);
  }
}
