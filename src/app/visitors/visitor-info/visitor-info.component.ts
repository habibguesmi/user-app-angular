import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visitor-info',
  templateUrl: './visitor-info.component.html',
  styleUrls: ['./visitor-info.component.scss']
})
export class VisitorInfoComponent implements OnInit {
  visitors: { ip: string; city: string; country: string }[] = [];

  ngOnInit(): void {
    const stored = localStorage.getItem('visitors');
    if (stored) {
      try {
        this.visitors = JSON.parse(stored);
      } catch (e) {
        console.error('Erreur de parsing localStorage.visitors:', e);
      }
    }

    // Ajout du visiteur actuel
    if (typeof window !== 'undefined') {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          const visitor = {
            ip: data.ip,
            city: data.city || 'Inconnu',
            country: data.country_name || 'Inconnu'
          };

          // Évite les doublons d'IP
          const exists = this.visitors.some(v => v.ip === visitor.ip);
          if (!exists) {
            this.visitors.push(visitor);
            localStorage.setItem('visitors', JSON.stringify(this.visitors));
          }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données IP:', error);
        });
    }
  }
}
