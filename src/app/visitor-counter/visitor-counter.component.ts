import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-visitor-counter',
  templateUrl: './visitor-counter.component.html',
  styleUrls: ['./visitor-counter.component.scss']
})
export class VisitorCounterComponent implements OnInit, OnDestroy {
  count = 0;
  socket: WebSocket | null = null;

  ngOnInit(): void {
    this.socket = new WebSocket('ws://userapi-5rvm.onrender.com/ws/visitors');
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.count = data.count;
    };
    this.socket.onerror = (err) => {
      console.error('WebSocket error', err);
    };
  }

  ngOnDestroy(): void {
    this.socket?.close();
  }
}
