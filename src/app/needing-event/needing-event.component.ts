import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NeedingEventService} from "../needing-event.service";
import {ActivatedRoute} from "@angular/router";
import {NeedingEvent} from "./needing-event";

@Component({
  selector: 'app-needing-event',
  templateUrl: './needing-event.component.html',
  styleUrl: './needing-event.component.css'
})
export class NeedingEventComponent implements OnInit{

  needingEvent: any;
  needingEventId!: string;
  userId!: string;
  needingEventOfUser: NeedingEvent[] = [] ;
  // @ViewChild('needDiv') needDiv!: ElementRef;

  constructor(private needingEventService: NeedingEventService,
              private route: ActivatedRoute) { }


  // ngOnInit(): void {
  //   this.route.queryParamMap.subscribe(params => {
  //     const id = params.get('needingEventId');
  //     if (id) {
  //       this.needingEventId = id;
  //       this.getNeedingEvent();
  //     } else {
  //       console.error('Needing Event ID is missing or undefined');
  //     }
  //   });
  // }


  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('userId');
      if (id) {
        this.userId = id;
        this.getNeedingEventById();
      } else {
        console.error('User id is missing or undefined');
      }
    });
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
