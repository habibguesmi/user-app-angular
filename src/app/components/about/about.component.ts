import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  imageUrl = "";

  constructor() { }

  ngOnInit(): void {
    this.imageUrl = "https://source.unsplash.com/400x300/?team,people";
  }

}
