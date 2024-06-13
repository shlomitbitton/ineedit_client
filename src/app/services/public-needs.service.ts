import { Injectable } from '@angular/core';
import {development} from "../../environments/environment";
import {Observable} from "rxjs";
import {NeedingEvent} from "../models/needing-event";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PublicNeedsService {

  private apiUrl = development.apiUrl;

  constructor(private http: HttpClient) { }

  getPublicNeeds(): Observable<NeedingEvent[]> {
    return this.http.get<NeedingEvent[]>(this.apiUrl + "public-needs");
  }
}
