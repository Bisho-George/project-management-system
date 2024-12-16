import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isDarkTheme = false;
  sidebarBoolean: boolean = true;
  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.isDarkTheme = theme === 'dark';
    }
    else {
      this.isDarkTheme = false;
    }
  }
  onChange(value: boolean) {
    this.sidebarBoolean = value;
  }
}
