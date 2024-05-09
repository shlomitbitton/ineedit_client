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
  shoppingCategory = new FormControl('');
  shoppingCategories!: any;
  subscriptions: Subscription = new Subscription();
  isDropdownVisible: boolean = false;
  isInputVisible: boolean = false;
  // isButtonLike: boolean = false;
  newItemName: string ='';
  userFirstName!: string;
  showEmptyList = false;

  constructor(private needingEventService: NeedingEventService,
              private route: ActivatedRoute) { }


  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  toggleInput() {
    this.isInputVisible = !this.isInputVisible;
  }

  getImagePathForVendor(vendor: string):string {
    return `/assets/vendorLogo/${vendor}.png`;
  }

  updateVendor(userNeed: NeedingEvent, updatedVendor: string | null) {
    this.needingEventService.createOrUpdateVendor(userNeed, updatedVendor).subscribe({
      next: (response) => {
        console.info(`updating vendor: `+ response.shoppingCategory);
        this.vendor = response.vendor;
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

  updateCategory(userNeed: NeedingEvent, updatedCategory: string | null) {
    this.needingEventService.createOrUpdateShoppingCategory(userNeed, updatedCategory).subscribe({
      next: (response) => {
        console.info(`updating category: `+ response.shoppingCategory);
        this.shoppingCategory = response.shoppingCategory;
        this.getNeedingEventByUserId();
      },
      error: (error) => {
        console.error('Error updating shopping category:', error);
      },
      complete: () => {
        this.isDropdownVisible = false;
      }
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.queryParamMap.subscribe(params => {
        const id = params.get('user-id');
        if (id) {
          this.userId = id;
          this.getNeedingEventByUserId();
        } else {
          console.error('User id is missing or undefined');
        }
      })
    );
    this.subscriptions.add(
      this.needingEventService.getAllShoppingCategories().subscribe({
        next: (response) => {
          console.log('Getting shopping categories', response);
          this.shoppingCategories = response;
        },
        error: (error) => {
          console.error('Failed to get shopping categories', error);
        }
      })
    );
    this.subscriptions.add(
    this.route.queryParams.subscribe(params => {
      const userId = params['user-id'];
      if (userId) {
        this.needingEventService.getUserFirstName(userId).subscribe({
          next: (userDetails: UserDetails) => {
            this.userFirstName = userDetails.userFirstName;
          },
          error: (error: any) => {
            console.error('Failed to get user first name', error);
          }
        });
      }
    }));
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
    // const needingEventStatus = userNeed.needingEventStatus === 'Need' ? 'Fulfilled' : 'Need';
    this.needingEventService.updateStatus(needingEventId).subscribe({
      next: (response) => {
        console.log('Status updated successfully');
      },
      error: (error) => {
        console.error('Failed to update status', error);
      }
    });
  }


  getNeedingEventByUserId(): void {
    this.needingEventService.getNeedingEventByUserId(this.userId).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Data is a non-empty array
          this.needingEventOfUser = data;
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
