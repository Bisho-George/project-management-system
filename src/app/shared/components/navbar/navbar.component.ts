import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { IUserProfile } from '../../interface/user-profile/user-profile-interface';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  profileLink = '/dashboard/profile';
  darkMode = false;
  user: IUserProfile | null = null;
  baseUrl = 'https://upskilling-egypt.com:3003/';
  constructor(private authService: AuthService, private profile: ProfileService, private toast: ToastrService) {
    this.profile.user.subscribe((user) => {
      if (user?.imagePath) {
        user.imagePath = this.baseUrl + user.imagePath;
      }
      this.user = user;
    });
    // const savedTheme = localStorage.getItem('theme');
    // this.darkMode = savedTheme === 'dark';
    // this.applyTheme();
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  toggleTheme(): void {
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }
  getCurrentUser() {
    this.profile.getCurrentUser().subscribe({
      next: (user) => {
        if (user.imagePath) {
          user.imagePath = this.baseUrl + user.imagePath;
        }
        this.user = user;
      },
      error: (err) => {
        this.toast.error(err.error.message);
      }
    });
  }
  logout() {
    this.authService.logout();
  }

}
