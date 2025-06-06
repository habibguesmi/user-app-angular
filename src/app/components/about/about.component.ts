import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() { 
    this.title.setTitle('À propos | Application Gestion Utilisateurs');
    this.meta.updateTag({
      name: 'description',
      content: 'Présentation de l\'application Angular pour gérer les utilisateurs avec backend Java.'
    });

  }
}
