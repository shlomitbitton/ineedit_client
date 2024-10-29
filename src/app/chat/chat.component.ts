import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  messages: string[] = [];
  newMessage: string = '';
  constructor(private websocketService: WebsocketService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {

  }

  sendMessage() {
    this.websocketService.sendMessage('/app/chat', 'Hello from the client!');
    console.log('Chat initialized with owner:');
  }

  close() {
    // close the dialog
  }



}
