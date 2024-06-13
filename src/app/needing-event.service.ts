import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, withFetch} from "@angular/common/http";
import { catchError, map, Observable, of, switchMap} from "rxjs";
import {NeedingEvent} from "./models/needing-event";
import {ActivatedRoute} from "@angular/router";
import {UserDetails} from "./models/user-details";
import {production} from "../environments/environment.prod";
import {development} from "../environments/environment";


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
    console.log(`getNeedingEventByUserId`);
    return this.http.get<NeedingEvent[]>(this.apiUrl+"all-needs-by-user", {params: params})
      .pipe(
        catchError(this.handleError<NeedingEvent[]>("Error fetching needing events", []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`, error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  updateStatus(needingEventId: number) {
    const url = `${this.apiUrl}update-needing-event-status?needing-event-id=${needingEventId}`;
    return this.http.post(url, {});
  }

  updateIsPublic(needingEventId: number) {
    const url = `${this.apiUrl}make-need-public?needing-event-id=${needingEventId}`;
    return this.http.post(url, {});
  }

  // This method is a machine learning method to fetch previously categorized item
  getShoppingCategory(newItemName: string): Observable<string | null> {
    console.log(`Getting shopping category for item: ${newItemName}`);
    // Fetch the user's existing items from the needingEventService
    return this.getNeedingEventByUserId(this.userId).pipe(
      map(events => {
        console.log("console.log(events): "+events);
        const normalizedNewItemName = newItemName.toLowerCase();
        const existingItem = events.find(event =>
          event.itemNeededName.valueOf().toLowerCase() === normalizedNewItemName
        );
        if (existingItem) {
          console.log(`Found existing item, shopping category: ${existingItem.shoppingCategory}`);
          return existingItem.shoppingCategory;
        } else {
          console.log(`No existing item found. Using default category: GENERAL`);
          return 'GENERAL';
        }
      }),
      catchError(error => {
        console.error('Error in getting shopping category', error);
        return of(null); // Handle errors or rethrow as needed
      })
    );
  }

  getVendor(newItemName: string): Observable<string | null> {
    console.log(`Getting vendor for item: ${newItemName}`);
    // Fetch the user's existing items from the needingEventService
    return this.getNeedingEventByUserId(this.userId).pipe(
      map(events => {
        console.log("console.log(events): "+events);
        const normalizedNewItemName = newItemName.toLowerCase();
        const existingItem = events.find(event =>
          event.itemNeededName.valueOf().toLowerCase() === normalizedNewItemName
        );
        if (existingItem) {
          console.log(`Found existing item, vendor: ${existingItem.potentialVendor}`);
          return existingItem.potentialVendor;
        } else {
          console.log(`No existing item found. Using default vendor: On-line`);
          return 'On-Line';
        }
      }),
      catchError(error => {
        console.error('Error in getting vendor', error);
        return of(null); // Handle errors or rethrow as needed
      })
    );
  }

  createOrUpdateItem(newItemName: string): Observable<any> {
    console.log(`Creating or updating item: ${newItemName}`);
    return this.getShoppingCategory(newItemName).pipe(
      switchMap(shoppingCategory => {
        if (shoppingCategory === null) {
          console.error('Failed to get shopping category');
          return of(null); // Optionally handle this case differently
        }
        // Fetch the vendor using the getVendor method
        return this.getVendor(newItemName).pipe(
          switchMap(vendorName => {
            // If no vendor was found, default to 'On-line'
            vendorName = vendorName || 'On-line';
            const body = {
              itemNeeded: newItemName,
              shoppingCategory: shoppingCategory,
              userId: this.fetchUserDetails(this.userId),
              vendorName: vendorName  // Use the fetched or default vendor name
            };
            const url = `${this.apiUrl}add-update-needing-event`;
            return this.http.post(url, body);
          }),
          catchError(error => {
            console.error('Error while fetching vendor', error);
            return of(null);  // Optionally handle vendor fetch error differently
          })
        );
      }),
      catchError(error => {
        console.error('Error creating or updating item', error);
        return of(null);
      })
    );
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


  // updateNeedNotes(eventId: number, note: string): Observable<any> {
  //   console.log(`Update need note: ${note}`);
  //   const body = {
  //     needEventId: eventId,
  //     needNotes: note
  //   };
  //   const url = `${this.apiUrl}update-need-notes`;
  //   return this.http.post(url, body);
  // }

}
