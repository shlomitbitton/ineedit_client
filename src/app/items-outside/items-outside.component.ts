import {Component, OnInit} from '@angular/core';
import {AvailableItem} from "../models/AvailableItem";
import {NotifyDropoffService} from "../services/notify-dropoff.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-items-outside',
  templateUrl: './items-outside.component.html',
  styleUrl: './items-outside.component.css'
})
export class ItemsOutsideComponent implements OnInit {
  availableItems: AvailableItem[] = [];
  errorMessage: string | null = null;
  zipCodeFilter: string = '';
  private apiUrl = environment.apiUrl;
  username: string = '';

  constructor(private notifyDropoffService: NotifyDropoffService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().subscribe(userEmail => {
      this.username = userEmail;
    });
    this.fetchAvailableItems();
    console.log('Current user email set:', this.username);
  }

  showDeleteButton(userEmail: string): boolean {
    if (userEmail === this.username) {
      return true;
    }
    return false;
  }

  fetchAvailableItems(): void {
    this.notifyDropoffService.getAvailableItems().subscribe({
      next: (data: AvailableItem[]) => {
        this.availableItems = data;
      },
      error: (error) => {
        console.error('Error fetching available items:', error);
      }
    });
  }

  loadImage(fileLocation: string): string {
    if (fileLocation) {
      return this.apiUrl + `files${fileLocation}`;
    }
    return '';
  }

  filteredItems() {
    return this.availableItems.filter(item =>
      this.zipCodeFilter ? item.zipcode.includes(this.zipCodeFilter) : true
    );
  }

  deleteItem(itemId: number) {
    console.log(`Deleting item with id: ${itemId}`);
    this.notifyDropoffService.deleteAvailableItem(itemId).subscribe({
      next: () => {
        console.log('Item deleted successfully ');
        this.fetchAvailableItems();
      },
      error: (error) => {

        console.error('Error deleting item:', error);
      }
    });
  }
}


