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
  searchTerm = '';
  filteredVisitors: { ip: string; city: string; country: string }[] = [];

  ngOnInit(): void {
    // Génère un identifiant unique s'il n'existe pas
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitorId', visitorId);
    }
    this.visitorId = visitorId;

    const stored = localStorage.getItem('visitors');
    if (stored) {
      try {
        this.visitors = JSON.parse(stored);
      } catch (e) {
        console.error('Erreur de parsing localStorage.visitors:', e);
      }
    }

    this.updateFiltered();

    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost';
      const socketUrl = isLocalhost
        ? 'http://localhost:8080/ws/visitors'
        : 'https://userapi-5rvm.onrender.com/ws/visitors';

      const sock = new SockJS(socketUrl);

      sock.onopen = () => {
        console.log('✅ WebSocket connected');
        sock.send(JSON.stringify({ type: 'init', visitorId: this.visitorId }));
      };
      sock.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        this.visitorCount = data.count;

        this.visitors = data.visitors.filter((v: { ip: string }) => !v.ip.includes(':'));
        this.updateFiltered();

        localStorage.setItem('visitors', JSON.stringify(this.visitors));
      };
      sock.onclose = () => console.log('⚠️ WebSocket closed');
    }
  }

  updateFiltered() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredVisitors = [...this.visitors];
    } else {
      this.filteredVisitors = this.visitors.filter(v =>
        v.city.toLowerCase().includes(term) || v.country.toLowerCase().includes(term)
      );
    }
  }

  getFlagEmoji(countryName: string): string {
    const overrides: { [key: string]: string } = {
      'United States': 'US',
      'United Kingdom': 'GB',
      'South Korea': 'KR',
      'North Korea': 'KP',
      'Russia': 'RU',
      'Inconnu': ''
    };

    const fallbackMap: { [key: string]: string } = {
      France: 'FR',
      Germany: 'DE',
      Spain: 'ES',
      Italy: 'IT',
      Canada: 'CA',
      Morocco: 'MA',
      Belgium: 'BE',
      Tunisia: 'TN',
      Algeria: 'DZ',
      Portugal: 'PT',
      Netherlands: 'NL',
      Switzerland: 'CH',
      Australia: 'AU'
    };

    const code = overrides[countryName] || fallbackMap[countryName] || '';
    if (!code) return '';

    return code
      .toUpperCase()
      .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
  }
}
