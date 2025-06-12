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
  dataReady = false;

  ngOnInit(): void {
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
        this.updateFiltered();
      } catch (e) {
        console.error('Erreur parsing localStorage.visitors:', e);
      }
    }

    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost';
      const socketUrl = isLocalhost
        ? 'http://localhost:8080/ws/visitors'
        : 'https://userapi-5rvm.onrender.com/ws/visitors';

      const sock = new SockJS(socketUrl);

      sock.onopen = () => {
        sock.send(JSON.stringify({ type: 'init', visitorId: this.visitorId }));
      };

      sock.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        this.visitorCount = data.count;
        this.visitors = data.visitors.filter((v: { ip: string }) => !v.ip.includes(':'));
        this.updateFiltered();

        localStorage.setItem('visitors', JSON.stringify(this.visitors));
        this.dataReady = true;
      };
      setTimeout(() => {
        if (!this.dataReady && this.visitors.length > 0) {
          console.warn('⏳ Timeout WebSocket — fallback aux données locales');
          this.dataReady = true;
        }
      }, 5000); // 5 secondes

      sock.onclose = () => console.log('WebSocket fermé');
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

  getFlagUrl(countryName: string): string {
    const countryCodes: { [key: string]: string } = {
      'France': 'fr',
      'United States': 'us',
      'Germany': 'de',
      'Spain': 'es',
      'Italy': 'it',
      'Canada': 'ca',
      'Morocco': 'ma',
      'Inconnu': ''
    };
    const code = countryCodes[countryName] || '';
    return code ? `https://flagcdn.com/w40/${code}.png` : '';
  }
}
