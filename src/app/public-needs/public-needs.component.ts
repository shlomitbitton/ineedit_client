import {Component, OnDestroy, OnInit} from '@angular/core';
import {NeedingEvent} from "../models/Needing-event";
import {PublicNeedsService} from "../services/public-needs.service";
import {WebsocketService} from "../services/websocket.service";
import {MatDialog} from "@angular/material/dialog";
import {ChatComponent} from "../chat/chat.component";

@Component({
  selector: 'app-public-needs',
  templateUrl: './public-needs.component.html',
  styleUrl: './public-needs.component.css'
})
export class PublicNeedsComponent implements OnInit, OnDestroy {

  publicNeeds: NeedingEvent[] = [];


  showExploreLabel = false;
  constructor(private dialog: MatDialog, private needsService: PublicNeedsService, private webSocketService: WebsocketService) { }

  ngOnInit(): void {
    this.needsService.getPublicNeeds().subscribe({
      next: (needs) => this.publicNeeds = needs,
      error: (err) => console.error('Failed to fetch public needs', err)
    });
    this.webSocketService.connect();
  }


  openChat(ownerEmail: string): void {
    const dialogRef = this.dialog.open(ChatComponent, {
      width: '400px',
      data: { ownerEmail: ownerEmail }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Chat dialog was closed');
    });
  }
  ngOnDestroy() {
    // Disconnect from WebSocket when component is destroyed
    this.webSocketService.disconnect();
  }

}
