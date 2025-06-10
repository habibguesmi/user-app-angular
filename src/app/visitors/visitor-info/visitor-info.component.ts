import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-visitor-info',
  templateUrl: './visitor-info.component.html',
  styleUrls: ['./visitor-info.component.scss']
})
export class VisitorInfoComponent implements OnInit {
  visitors: { ip: string; city: string; country: string }[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('visitors');
      if (data) {
        this.visitors = JSON.parse(data);
      }
    }
  }
}
