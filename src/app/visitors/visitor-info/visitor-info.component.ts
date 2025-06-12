import { Component, OnInit } from '@angular/core';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-visitor-info',
  templateUrl: './visitor-info.component.html',
  styleUrls: ['./visitor-info.component.scss']
})
export class VisitorInfoComponent implements OnInit {
  visitorId!: string;
  visitors: { ip: string; city: string; country: string }[] = [];
  visitorCount = 0;

  ngOnInit(): void {
    // ✅ Génère un identifiant unique de visiteur s'il n'existe pas déjà
let visitorId = localStorage.getItem('visitorId');
if (!visitorId) {
  visitorId = crypto.randomUUID(); // Nécessite un navigateur récent
  localStorage.setItem('visitorId', visitorId);
}
this.visitorId = visitorId; // Stocke pour utilisation WebSocket

    const stored = localStorage.getItem('visitors');
    if (stored) {
      try {
        this.visitors = JSON.parse(stored);
      } catch (e) {
        console.error('Erreur de parsing localStorage.visitors:', e);
      }
    }

    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost';
      const socketUrl = isLocalhost
        ? 'http://localhost:8080/ws/visitors'
        : 'https://userapi-5rvm.onrender.com/ws/visitors';

      const sock = new SockJS(socketUrl);

      sock.onopen = () => {
        console.log('✅ WebSocket connected');
        // ✅ Envoie l'identifiant unique dès l'ouverture
        sock.send(JSON.stringify({ type: 'init', visitorId: this.visitorId }));
      };
      sock.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        this.visitorCount = data.count;

        // Exclure IPv6 par exemple
        this.visitors = data.visitors.filter((v: { ip: string }) => !v.ip.includes(':'));

        this.visitors = data.visitors;

        localStorage.setItem('visitors', JSON.stringify(this.visitors));
      };
      sock.onclose = () => console.log('⚠️ WebSocket closed');
    }
  }
}
