import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isHomePage = false;
  menuOpen = false;
  currentRoute = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/' || event.urlAfterRedirects === '/';
        if (!this.isHomePage) {
          this.menuOpen = false; // Fermer menu automatiquement si on quitte la home
        }
      }
    });
  }
 

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu() {
    if (this.menuOpen) this.menuOpen = false;
  }
}
