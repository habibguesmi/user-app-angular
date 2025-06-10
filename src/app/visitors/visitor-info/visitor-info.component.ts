import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visitor-info',
  templateUrl: './visitor-info.component.html',
  styleUrls: ['./visitor-info.component.scss']
})
export class VisitorInfoComponent implements OnInit {
  visitors: { ip: string; city: string; country: string }[] = [];

  ngOnInit(): void {
    const data = localStorage.getItem('visitors');
    if (data) {
      this.visitors = JSON.parse(data);
    }
  }
}
