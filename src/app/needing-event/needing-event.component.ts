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
  needingEventOfUser: NeedingEvent[] = [] ;
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
  needyEventsMap: NeedyEventsMap = {};
  fulfilledNeedsMap: { [vendor: string]: NeedingEvent[] } = {};
  filteredEventsMap = new Map();

  constructor(private cdr: ChangeDetectorRef, private needingEventService: NeedingEventService,
              private route: ActivatedRoute, private authService: AuthService) { }


  exportNeeds(): void {
    const neededItems = this.needingEventOfUser.filter(item => item.needingEventStatus === 'Need');
    const neededNames = neededItems.map(item => item.itemNeededName).join('\n');
    // Create a blob with the needed items' names
    const blob = new Blob([neededNames], { type: 'text/plain;charset=utf-8' });

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

  //
  // getBackgroundColorClass(vendor: string): string {
  //   if (vendor !== this.lastVendor) {
  //     this.currentColorClass = this.currentColorClass === 'background-color-1' ? 'background-color-2' : 'background-color-1';
  //     this.lastVendor = vendor;
  //   }
  //   return this.currentColorClass;
  // }

  // computeBackgroundClasses(): void {
  //   this.needingEventOfUser.forEach(event => {
  //     event.backgroundColorClass = this.getBackgroundColorClass(event.potentialVendor);
  //   });
  // }



  // getBackgroundColorClass(vendor: string): string {
  //   if (vendor !== this.lastVendor) {
  //     this.currentColorClass = this.currentColorClass === 'background-color-1' ? 'background-color-2' : 'background-color-1';
  //     this.lastVendor = vendor;
  //   }
  //   return this.currentColorClass;
  // }
  // toggleDropdown() {
  //   this.isDropdownVisible = !this.isDropdownVisible;
  // }

  toggleInput() {
    this.isInputVisible = !this.isInputVisible;
  }

  filterFulfilledNeeds(): void {
    const filteredMap: NeedyEventsMap = {};
    for (const [vendor, events] of Object.entries(this.needyEventsMap)) {
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

  private filterVendors() {
    for (const [vendor, events] of Object.entries(this.needyEventsMap)) {
      const neededEvents = events.filter(event => event.needingEventStatus === 'Need');
      if (neededEvents.length > 0) {
        this.filteredEventsMap.set(vendor, neededEvents);
      } else {
        this.filteredEventsMap.delete(vendor);
      }
    }
    this.cdr.detectChanges();  // Manually trigger change detection
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
            this.needyEventsMap = data;
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
