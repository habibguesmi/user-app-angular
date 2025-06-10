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
  }
}
