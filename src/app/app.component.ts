import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isHomePage = false;
  menuOpen = false;
  currentRoute = '';

  constructor(private router: Router, private title: Title, private meta: Meta) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        this.isHomePage = this.currentRoute === '/';
        this.updateSEO();
        if (!this.isHomePage) {
          this.menuOpen = false;
        }
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }
  updateSEO() {
    const description = "Application Angular avec NgRX Store et SSR pour la gestion des utilisateurs avec API REST Java Spring Boot. Ajout, modification, suppression d'utilisateurs. WebSocket en temps réel, menu responsive Material Design";

    this.title.setTitle("Application Gestion Utilisateurs Angular + Java");
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'Angular, Java Spring Boot, SSR, API REST, WebSocket, gestion utilisateurs, Material Design' });
    this.meta.updateTag({ name: 'author', content: 'Habib Guesmi' });
  }
}
