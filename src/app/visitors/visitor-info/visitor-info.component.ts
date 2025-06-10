import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-visitor-info',
  templateUrl: './visitor-info.component.html',
  styleUrls: ['./visitor-info.component.scss']
})
export class VisitorInfoComponent {
  @Input() visitors: { ip: string; city: string; country: string }[] = [];
}
