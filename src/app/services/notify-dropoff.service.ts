import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {AvailableItem} from "../models/AvailableItem";
import {HttpClient, HttpStatusCode} from "@angular/common/http";
import {AvailableItemsListResponseDto} from "../models/AvailableItemsListResponseDto";

@Injectable({
  providedIn: 'root'
})
export class NotifyDropoffService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }


  createAvailableItem(formData: any): Observable<AvailableItem> {
    return this.http.post<AvailableItem>(this.apiUrl + 'available-item-create-upload', formData);
  }

  getAvailableItems(): Observable<AvailableItem[]> {
    return this.http.get<AvailableItemsListResponseDto>(this.apiUrl + 'available-items-list').pipe(
      map(response => response.availableItemResponseDtoList)
    );
  }

  deleteAvailableItem(itemId: number) {
    return this.http.post<HttpStatusCode>(`${this.apiUrl}remove-available-item/${itemId}`, {});
  }
}
