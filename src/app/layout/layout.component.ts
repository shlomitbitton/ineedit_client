import { Component } from '@angular/core';
import {NeedingEventService} from "../needing-event.service";
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {NeedingEvent} from "../needing-event/needing-event";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  newItemName: string ='';
  needingEvent!: NeedingEvent;
  userFirstName!: string;

  constructor(private needingEventService: NeedingEventService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        this.userFirstName = this.needingEventService.fetchUserDetails(userId);
      }
    });
  }


  addItem() {
    console.log(`Adding item: ${this.newItemName}`);
    if (!this.newItemName) {
      console.error('No item name provided');
      return;
    }
    this.needingEventService.createOrUpdateItem(this.newItemName, this.needingEvent );
  }



}
