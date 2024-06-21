import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NeedingEventService} from "../needing-event.service";
import {ActivatedRoute} from "@angular/router";
import {NeedingEvent} from "../models/needing-event";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../auth.service";
import {NeedyEventsMap} from "../models/NeedyEventsMap";


@Component({
  selector: 'app-needing-event',
  templateUrl: './needing-event.component.html',
  styleUrls: ['./needing-event.component.css']

})
export class NeedingEventComponent implements OnInit{

  needingEvent!: NeedingEvent;
  needingEventId!: string;
  userId!: string | null;
  vendorControl = new FormControl('');
  neednotes = new FormControl('');
  shoppingCategory = new FormControl('');
  isPublic: number = 1 ? 0 : 1;
  shoppingCategories!: any;
  subscriptions: Subscription = new Subscription();
  isDropdownVisible: boolean = false;
  isInputVisible: boolean = false;
  showNotes = false;
  newItemName: string ='';
  userFirstName!: string;
  showEmptyList = false;
  currentColorClass: string = 'background-color-1';
  needsEventsMap: NeedyEventsMap = {};
  fulfilledNeedsMap: { [vendor: string]: NeedingEvent[] } = {};
  filteredEventsMap = new Map();

  constructor(private cdr: ChangeDetectorRef, private needingEventService: NeedingEventService,
              private authService: AuthService) { }


  exportNeeds(): void {//TODO: later on I will add checkboxes to choose which vendor to export
    const neededNames: any[] = [];
    for (const [vendor, events] of Object.entries(this.needsEventsMap)) {
      // Filter the events to find only those that need processing and map to get the needed item names
      const filteredEvents = events.filter(event => event.needingEventStatus === 'Need').map(event => event.itemNeededName);
      console.log("Filtered Needed Items for vendor", vendor, filteredEvents);
      neededNames.push(...filteredEvents); // Spread operator to push each name individually
    }
    const neededNamesText = neededNames.join('\n');
    const blob = new Blob([neededNamesText], { type: 'text/plain;charset=utf-8' });

    // Automatically create a download link and click it
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'shopping-list.txt';  // Specify the file name here
    document.body.appendChild(a);
    a.click();
    // Clean up by revoking the Blob URL and removing the link
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }


  toggleInput() {
    this.isInputVisible = !this.isInputVisible;
  }

  filterFulfilledNeeds(): void {
    const filteredMap: NeedyEventsMap = {};
    for (const [vendor, events] of Object.entries(this.needsEventsMap)) {
      // Only keep the events that are fulfilled
      const fulfilledEvents = events.filter(event => event.needingEventStatus === 'Fulfilled');
      if (fulfilledEvents.length > 0) {
        filteredMap[vendor] = fulfilledEvents;
      }
    }
    this.fulfilledNeedsMap = filteredMap;
  }

  isFulfilledMapEmpty(): boolean {
    return Object.keys(this.fulfilledNeedsMap).length === 0;
  }

  getImagePathForVendor(vendor: string):string {
    return `/assets/vendorLogo/${vendor}.png`;
  }

  updateVendor(userNeed: NeedingEvent, updatedVendor: string | null) {
    this.needingEventService.createOrUpdateVendor(userNeed, updatedVendor).subscribe({
      next: (response) => {
        console.info(`updating vendor: `+ response.shoppingCategory);
        this.vendorControl.patchValue(response.vendor, {emitEvent: false});
        this.getNeedingEventByUserId();
      },
      error: (error) => {
        console.error('Error updating vendor:', error);
      },
      complete: () => {
        this.isInputVisible = false;
      }
    });
  }

  updateVendorOnBlurOrEnter(userNeed: NeedingEvent): void {
    if (this.vendorControl.value && this.vendorControl.value.trim() !== '' && this.vendorControl.value !== userNeed.potentialVendor) {
      this.updateVendor(userNeed, this.vendorControl.value.trim());
    } else {
      this.isInputVisible = false; // Hide input if no changes are made
    }
  }


  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    this.getNeedingEventByUserId();
  }


  filterVendors() {
    // Helper map to manage case-insensitive checks
    const caseInsensitiveMap = new Map();

    // Clear existing filtered map to avoid stale entries
    this.filteredEventsMap.clear();

    for (const [vendor, events] of Object.entries(this.needsEventsMap)) {
      const normalizedVendor = vendor.toLowerCase();
      const neededEvents = events.filter(event => event.needingEventStatus === 'Need');

      if (neededEvents.length > 0) {
        // Check if we already have this vendor under a different casing
        if (caseInsensitiveMap.has(normalizedVendor)) {
          // Retrieve the original case vendor name from the helper map
          const originalVendor = caseInsensitiveMap.get(normalizedVendor);
          // Merge new needed events with existing ones under the original casing
          this.filteredEventsMap.set(originalVendor, [...this.filteredEventsMap.get(originalVendor), ...neededEvents]);
        } else {
          // Add to the filtered map and helper map
          this.filteredEventsMap.set(vendor, neededEvents);
          caseInsensitiveMap.set(normalizedVendor, vendor);
        }
      } else {
        // If no needed events and vendor exists in case-insensitive map, consider removing
        if (caseInsensitiveMap.has(normalizedVendor)) {
          const originalVendor = caseInsensitiveMap.get(normalizedVendor);
          this.filteredEventsMap.delete(originalVendor);
        }
      }
    }

    // Manually trigger change detection
    this.cdr.detectChanges();
  }

  addItem() {
    console.log(`Adding item: ${this.newItemName}`);
    if (!this.newItemName) {
      console.error('No item name provided');
      return;
    }
    this.needingEventService.createOrUpdateItem(this.newItemName).subscribe({
      next: (response: any) => {
        console.log('Item successfully created/updated:', response);
        this.getNeedingEventByUserId();
        this.newItemName = '';
        this.showEmptyList = false;
      },
      error: (error: any) => console.error('Error updating new need:', error)
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getNeedingEvent(): void {
    this.needingEventService.getNeedingEventId(this.needingEventId)
      .subscribe(needingEvent => {
        this.needingEvent = needingEvent;
      });
  }

  deleteNeed(needingEventId: number) {
    this.needingEventService.deleteNeed(needingEventId).subscribe({
      next: (response) => {console.log("Need deleted successfully", response);
      this.getNeedingEventByUserId();
      },
      error: (error) => console.error("Error deleting need", error)
    });
  }




  toggleStatus(needingEventId: number): void {
    this.needingEventService.updateStatus(needingEventId).subscribe({
      next: (response) => {
        console.log('Status updated successfully');
        this.getNeedingEventByUserId();
      },
      error: (error) => {
        console.error('Failed to update status', error);
      }
    });
  }

  updateIsPublic(needingEventId: number): void {
    this.needingEventService.updateIsPublic(needingEventId).subscribe({
      next: (response) => {
        this.isPublic = 1;
        console.log('Status updated successfully');
        this.getNeedingEventByUserId();
      },
      error: (error) => {
        console.error('Failed to update public status', error);
      }
    });
  }


  getNeedingEventByUserId(): void {
    if (this.userId !== null) {
      this.needingEventService.getNeedingEventByUserId(this.userId).subscribe({
        next: (data) => {
          if (data && Object.keys(data).length > 0) {
            // Data is a non-empty array
            this.needsEventsMap = data;
            this.filterVendors();
            this.filterFulfilledNeeds();
            console.log('Needing events fetched successfully:', data);
          } else {
            // Data is empty
            this.showEmptyList = true;
            console.info('this.showEmptyList: ' + this.showEmptyList);
            console.warn('No needing events found for this user.');
          }
        },
        error: (err) => console.error('Failed to fetch events:', err)
      });
  }
  }

}
