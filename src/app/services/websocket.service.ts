import { Injectable } from '@angular/core';
import {Client, IMessage} from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client;

  constructor() {
    this.stompClient = new Client({
      brokerURL: 'http://localhost:8080/chat',
      reconnectDelay: 5000,  // Auto reconnect in case of disconnect
      heartbeatIncoming: 4000,  // Keep alive settings (optional)
      heartbeatOutgoing: 4000
    });

    // Subscribe to a topic after connecting
    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);

      this.stompClient.subscribe('/topic/messages', (message: IMessage) => {
        console.log('Received message:', message.body);
      });
    };

    // Log connection errors
    this.stompClient.onStompError = (error) => {
      console.error('Broker reported error: ' + error.headers['message']);
      console.error('Additional details: ' + error.body);
    };
  }


  connect() {
    this.stompClient.activate();
  }

// Disconnect when done
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  // Send a message through the WebSocket
  sendMessage(destination: string, message: string) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: destination,
        body: message
      });
    } else {
      console.error('Stomp client is not connected!');
    }
  }

  onMessageReceived() {
    this.stompClient.onConnect = () => {
      this.stompClient.subscribe('/topic/messages', (message: IMessage) => {
        console.log('Received message: ', message.body);
      });
    };
  }
}

