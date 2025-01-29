import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from 'src/app/Models/Category';
import { CommonService } from 'src/app/Services/common.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export default class SignInComponent implements OnInit {
  showPassword = false;
  isShowLoginError: boolean = false;
  loginError: string = '';
  isLoading: boolean = false;
  loginFormData: Login = new Login();
  isCheckingAuth: boolean = true; // Prevent UI flashing

  constructor(
    private route: Router,
    private dataService: HttpClientConnectionService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  // Check if user is already authenticated
  checkAuthentication(): void {
    this.loginFormData.userName = this.commonService.getCookie('userName');
    this.loginFormData.password = this.commonService.getCookie('password');

    if (this.loginFormData.userName && this.loginFormData.password) {
      const userId = this.commonService.getCookie('userId');
      localStorage.setItem('userId', userId);

      this.route.navigate(['/analytics']).then(() => {
        this.isCheckingAuth = false; // Prevent UI flashing
      });
    } else {
      this.isCheckingAuth = false;
    }
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Handle login submission
  OnSubmit(): void {
    this.isLoading = true;
    this.isShowLoginError = false;

    if (!this.loginFormData.userName || !this.loginFormData.password) {
      this.showError('Username or Password cannot be empty');
      return;
    }

    setTimeout(() => {
      this.dataService.PostData('Administrator/Login', this.loginFormData).subscribe(
        (data: any) => {
          if (this.loginFormData.rememberMe) {
            this.commonService.setCookie('userName', this.loginFormData.userName, 30);
            this.commonService.setCookie('password', this.loginFormData.password, 30);
            this.commonService.setCookie('userId', data.id, 30);
          }
          localStorage.setItem('userId', data.id);
          this.route.navigate(['/analytics']);
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this.showError(error.error.message || 'Login failed');
        }
      );
    }, 2000);
  }

  // Show error messages
  private showError(message: string) {
    this.isLoading = false;
    this.loginError = message;
    this.isShowLoginError = true;
    setTimeout(() => {
      this.isShowLoginError = false;
    }, 3000);
  }
}
