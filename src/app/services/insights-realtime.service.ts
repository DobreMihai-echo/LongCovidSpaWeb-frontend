import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { InsightDTO } from './insights.service';
import { environment } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class InsightsRealtimeService {
  private client?: Client;
  private out$ = new Subject<InsightDTO>();
  connect(username: string) {
    if (this.client?.active) return;
    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      reconnectDelay: 3000
    });
    this.client.onConnect = () => {
      this.client!.subscribe(`/queue/insights/${username}`, (m: IMessage) =>
        this.out$.next(JSON.parse(m.body) as InsightDTO)
      );
    };
    this.client.activate();
  }
  stream(){ return this.out$.asObservable(); }
  disconnect(){ this.client?.deactivate(); }
}