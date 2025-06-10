import { Component, OnInit, OnDestroy } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { WindowService } from '../../core/services/window.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visitor-counter',
  templateUrl: './visitor-counter.component.html',
  styleUrls: ['./visitor-counter.component.scss']
})
export class VisitorCounterComponent implements OnInit, OnDestroy {
  count = 0;
  socket: WebSocket | null = null;

  constructor(private windowService: WindowService, private router: Router) {}

  ngOnInit(): void {
    const win = this.windowService.nativeWindow;

    if (win) {
      const isLocalhost = win.location.hostname === 'localhost';
      const socketUrl = isLocalhost
        ? 'http://localhost:8080/ws/visitors'
        : 'https://userapi-5rvm.onrender.com/ws/visitors';

      const sock = new SockJS(socketUrl);

      sock.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          this.count = data.count;

          // Save visitors list in localStorage
          if (data.visitors) {
            localStorage.setItem('visitors', JSON.stringify(data.visitors));
          }
        } catch (error) {
          console.error('Invalid message format', error);
        }
      };

      sock.onerror = (err: Event) => {
        console.error('WebSocket error', err);
      };

      this.socket = sock as unknown as WebSocket;
    }
  }

  ngOnDestroy(): void {
    this.socket?.close();
  }

  goToVisitorInfo(): void {
    this.router.navigate(['/visitor-info']);
  }
}
