import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { HealthData } from '../models/appconstants/health';
import { environment } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client!: Client;
  private sub?: StompSubscription;
  private stream$ = new Subject<HealthData>();

  connect(username: string, token?: string) {
    if (this.client?.active) return;
    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      reconnectDelay: 3000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {}
    });
    this.client = new Client({ webSocketFactory: () => new SockJS(environment.wsUrl), reconnectDelay: 3000 });
this.client.onConnect = () => {
  this.sub = this.client.subscribe(`/queue/healthdata/${username}`, msg => {
    this.stream$.next(JSON.parse(msg.body));
  });
};
this.client.activate();

  }

  disconnect() { this.sub?.unsubscribe(); this.client?.deactivate(); }
  updates$() { return this.stream$.asObservable(); }
}