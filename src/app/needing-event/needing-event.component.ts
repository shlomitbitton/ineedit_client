import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NeedingEventService} from "../needing-event.service";
import {ActivatedRoute} from "@angular/router";
import {NeedingEvent} from "./needing-event";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";

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

  constructor(private needingEventService: NeedingEventService,
              private route: ActivatedRoute) { }


  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  getImagePathForVendor(vendor: string):string {
    return `/assets/vendorLogo/${vendor}.png`;
  }

  updateVendor(userNeed: NeedingEvent, updatedVendor: string | null) {
    this.needingEventService.createOrUpdateVendor(userNeed, updatedVendor);
  }
  updateCategory(userNeed: NeedingEvent, updatedCategory: string | null) {
    this.needingEventService.createOrUpdateShoppingCategory(userNeed, updatedCategory).subscribe({
      next: (response) => {
        console.info(`updating category: `+ response.shoppingCategory);
        this.shoppingCategory = response.shoppingCategory;
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
        const id = params.get('userId');
        if (id) {
          this.userId = id;
          this.getNeedingEventById();
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


  getNeedingEventById(): void {
    this.needingEventService.getNeedingEventByUserId(this.userId)
      .subscribe({next: (data) => {
      this.needingEventOfUser = data;
    },
      error: (err) => console.error('Failed to fetch strings:', err)
    });
  }


}
