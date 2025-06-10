import { Component, OnInit, OnDestroy } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { WindowService } from '../../core/services/window.service';

@Component({
  selector: 'app-visitor-counter',
  templateUrl: './visitor-counter.component.html',
  styleUrls: ['./visitor-counter.component.scss']
})
export class VisitorCounterComponent implements OnInit, OnDestroy {
  count = 0;
  socket: WebSocket | null = null;

  constructor(private windowService: WindowService) {}

  ngOnInit(): void {
    const win = this.windowService.nativeWindow;

    if (win) {
      console.log('Window is available');

      const isLocalhost = win.location.hostname === 'localhost';
      const socketUrl = isLocalhost
        ? 'http://localhost:8080/ws/visitors'
        : 'https://userapi-5rvm.onrender.com/ws/visitors';

      const sock = new SockJS(socketUrl);

      sock.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          console.log('👥 Détails:', data.count, data.visitors);
          this.count = data.count;
        } catch (error) {
          console.error('Invalid message format', error);
        }
      };

      sock.onerror = (err: Event) => {
        console.error('WebSocket error', err);
      };

      this.socket = sock as unknown as WebSocket;
    } else {
      console.log('SSR mode - window is not available');
    }
  }

  ngOnDestroy(): void {
    this.socket?.close();
  }
}
