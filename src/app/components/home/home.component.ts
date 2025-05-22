import { Component, Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @Output() closeMenuEvent = new EventEmitter<void>();
  constructor(private router: Router) {}

  goTo(path: string) {
    this.closeMenuEvent.emit(); 
    this.router.navigate([path]);
  }
  
}
