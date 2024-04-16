import { Component } from '@angular/core';
import {NeedingEventService} from "../needing-event.service";
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {NeedingEvent} from "../needing-event/needing-event";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  newItemName: string ='';

  constructor(private needingEventService: NeedingEventService) { }


  addItem() {
    console.log(`Adding item: ${this.newItemName}`);
    if (!this.newItemName) {
      console.error('No item name provided');
      return;
    }
    this.needingEventService.createOrUpdateItem(this.newItemName);
  }

}
