import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, withFetch} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of} from "rxjs";
import {NeedingEvent} from "./needing-event/needing-event";
import {ActivatedRoute} from "@angular/router";
import {UserDetails} from "./needing-event/user-details";
import {production} from "../environments/environment.prod";


@Injectable({
  providedIn: 'root'
})
export class NeedingEventService {
  shoppingCategory!: string;
  userId!: string;
  userFirstName: string ='';

  private apiUrl = production.apiUrl;
  constructor(private http: HttpClient, private route: ActivatedRoute) { }


  getNeedingEventId(needingEventId: string): Observable<any> {
    let params = new HttpParams()
      .set('needingEventId', needingEventId);
    return this.http.get(this.apiUrl +"needing-event", {params: params})
      .pipe(
        catchError(this.handleError<any>('getNeedingEventId'))
      );
  }

  getNeedingEventByUserId(userId: string): Observable<NeedingEvent[]> {
    let params = new HttpParams()
      .set('user-id', userId);
    this.userId = userId;
    return this.http.get<NeedingEvent[]>(this.apiUrl+"all-needs-by-user", {params: params})
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

  updateStatus(needingEventId: number) {
    const url = `${this.apiUrl}update-needing-event-status?needing-event-id=${needingEventId}`;
    return this.http.post(url, {});
  }

  createOrUpdateItem(newItemNae: string): Observable<any>  {
    console.log(`Creating or updating item: ${newItemNae}`);
    const body = {
      itemNeeded: newItemNae,
      shoppingCategory: 'GENERAL' ,
      userId: this.fetchUserDetails(this.userId),
      vendorName: 'On-line'
    };
    const url = `${this.apiUrl}add-update-needing-event`;
    return this.http.post(url, body);
  }

  createOrUpdateVendor(item: NeedingEvent, newVendorName: string | null):Observable<any> {
    console.log(`Creating or updating vendor: ${newVendorName}`);
    const body = {
      itemNeeded: item.itemNeededName,
      shoppingCategory: item.shoppingCategory,
      userId: this.userId,
      vendorName: newVendorName
    };
    const url = `${this.apiUrl}add-update-needing-event`;
    return this.http.post(url, body);
  }

  createOrUpdateShoppingCategory(item: NeedingEvent, shoppingCategory: string | null): Observable<any> {
    console.log(`Creating or updating shopping category: ${shoppingCategory}`);
    const body = {
      itemNeeded: item.itemNeededName,
      shoppingCategory: shoppingCategory,
      userId: this.userId,
      vendorName: item.potentialVendor
    };
    const url = `${this.apiUrl}add-update-needing-event`;
    return this.http.post(url, body);
  }

  getUserDetailsById(userId: string): Observable<any> {
    const url = `${this.apiUrl}user-details?user-id=${userId}`;
    return this.http.get(url);
  }

  getUserFirstName(userId: string): Observable<UserDetails> {
    const url = `${this.apiUrl}user-details?user-id=${userId}`;
    console.info("getUserFirstName");
    return this.http.get<UserDetails>(url);
  }

  fetchUserDetails(userId: string): string {
    console.info("fetching user details");
    this.getUserDetailsById(userId).subscribe({
      next: (data) => {
        this.userFirstName =  data.userFirstName;
      },
      error: (err) => {
        console.error('Failed to fetch user details:', err);
      }
    });
    return userId;
  }


  getAllShoppingCategories() {
    const url = `${this.apiUrl}shopping-category`;
    return this.http.get(url, {});
  }

  deleteNeed(needingEventId: number){
    const url = `${this.apiUrl}delete-need/${needingEventId}`;
    console.info("deleting needing event {}", needingEventId);
    return this.http.delete(url, {});
  }


}
