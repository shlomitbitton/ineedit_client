import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, withFetch} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {NeedingEvent} from "./needing-event/needing-event";

@Injectable({
  providedIn: 'root'
})
export class NeedingEventService {

  private apiUrl = 'http://localhost:8080/'; // URL to web api

  constructor(private http: HttpClient) { }


  getNeedingEventId(needingEventId: string): Observable<any> {
    let params = new HttpParams()
      .set('needingEventId', needingEventId);
    return this.http.get(this.apiUrl +"needingEvent", {params: params})
      .pipe(
        catchError(this.handleError<any>('getNeedingEventId'))
      );
  }

  getNeedingEventByUserId(userId: string): Observable<NeedingEvent[]> {
    let params = new HttpParams()
      .set('userId', userId);
    return this.http.get<NeedingEvent[]>(this.apiUrl+"allNeedsByUser", {params: params})
      .pipe(
        catchError(this.handleError<any>('getNeedingEventByUserId'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
