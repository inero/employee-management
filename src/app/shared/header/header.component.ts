import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public items: MenuItem[];

  constructor() { 
    this.items = [];
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Employee Management',
      }
    ];
  }
}
