import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NeedingEventService} from "../needing-event.service";
import {ActivatedRoute} from "@angular/router";
import {NeedingEvent} from "./needing-event";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {UserDetails} from "./user-details";

@Component({
  selector: 'app-needing-event',
  templateUrl: './needing-event.component.html',
  styleUrls: ['./needing-event.component.css']

})
export class NeedingEventComponent implements OnInit{

  needingEvent!: NeedingEvent;
  needingEventId!: string;
  userId!: string;
  needingEventOfUser: NeedingEvent[] = [] ;
  vendor = new FormControl('');
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
  fulfilledNeeds: NeedingEvent[] = [] ;
  currentColorClass: string = 'background-color-1';

  constructor(private needingEventService: NeedingEventService,
              private route: ActivatedRoute) { }


  exportNeeds(): void {
    // Assuming your items are stored in an array called 'items' and each item has a 'need' property
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

  filterFulfilledNeeds() {
    this.fulfilledNeeds = this.needingEventOfUser.filter(userNeed => userNeed.needingEventStatus === 'Fulfilled');
  }
  getImagePathForVendor(vendor: string):string {
    return `/assets/vendorLogo/${vendor}.png`;
  }

  updateVendor(userNeed: NeedingEvent, updatedVendor: string | null) {
    this.needingEventService.createOrUpdateVendor(userNeed, updatedVendor).subscribe({
      next: (response) => {
        console.info(`updating vendor: `+ response.shoppingCategory);
        this.vendor.patchValue(response.vendor, {emitEvent: false});
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
    if (this.vendor.value && this.vendor.value.trim() !== '' && this.vendor.value !== userNeed.potentialVendor) {
      this.updateVendor(userNeed, this.vendor.value.trim());
    } else {
      this.isInputVisible = false; // Hide input if no changes are made
    }
  }


  // updateCategory(userNeed: NeedingEvent, updatedCategory: string | null) {
  //   this.needingEventService.createOrUpdateShoppingCategory(userNeed, updatedCategory).subscribe({
  //     next: (response) => {
  //       console.info(`updating category: `+ response.shoppingCategory);
  //       this.shoppingCategory.patchValue(response.shoppingCategory);
  //       this.getNeedingEventByUserId();
  //     },
  //     error: (error) => {
  //       console.error('Error updating shopping category:', error);
  //     },
  //     complete: () => {
  //       this.isDropdownVisible = false;
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.queryParamMap.subscribe(params => {
        const userId = params.get('user-id');
        if (userId) {
          this.userId = userId;
          this.getNeedingEventByUserId();
          this.needingEventService.getUserFirstName(userId).subscribe({
            next: (userDetails: UserDetails) => {
              this.userFirstName = userDetails.userFirstName;
            },
            error: (error: any) => {
              console.error('Failed to get user first name', error);
            }
          });
        } else {
          console.error('User id is missing or undefined');
        }
      })
    );
    this.subscriptions.add(
      this.needingEventService.getAllShoppingCategories().subscribe({
        next: (response) => {
          //console.log('Getting shopping categories', response);
          this.shoppingCategories = response;
        },
        error: (error) => {
          console.error('Failed to get shopping categories', error);
        }
      })
    );
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
    this.needingEventService.getNeedingEventByUserId(this.userId).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Data is a non-empty array
          this.needingEventOfUser = data;
          this.filterFulfilledNeeds();
          console.log('Needing events fetched successfully:', data);
        } else {
          // Data is empty
          this.showEmptyList = true;
          console.info('this.showEmptyList: '+ this.showEmptyList);
          console.warn('No needing events found for this user.');
        }
      },
      error: (err) => console.error('Failed to fetch events:', err)
    });
  }




}
