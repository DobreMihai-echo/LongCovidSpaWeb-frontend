import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { HealthData } from '../models/appconstants/health';
import { environment } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client?: Client;
  private username?: string;

  private health$ = new Subject<any>();

  connect(username: string): void {
    this.username = (username || '').replace(/^"+|"+$/g, '');
    if (this.client?.active) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      reconnectDelay: 3000,
      debug: (s) => console.log('[STOMP]', s)
    });

    this.client.onConnect = () => {
      if (!this.username) return;
      this.client!.subscribe(`/queue/healthdata/${this.username}`, (m: IMessage) => {
        try { this.health$.next(JSON.parse(m.body)); } catch { this.health$.next(m.body); }
      });
    };

    this.client.activate();
  }

  updates$(): Observable<any> { return this.health$.asObservable(); }

  disconnect(): void { this.client?.deactivate(); this.client = undefined; }
}