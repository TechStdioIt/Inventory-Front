import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxSelectBoxModule } from 'devextreme-angular';
import { Login } from 'src/app/Models/Category';
import { DD_BusinessMasterId } from 'src/app/Models/drodown.model';
import { CommonService } from 'src/app/Services/common.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule,DxSelectBoxModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export default class SignInComponent implements OnInit {
  showPassword = false;
  isShowLoginError: boolean = false;
  loginError: string = '';
  isLoading: boolean = false;
  loginFormData: Login = new Login();
  isCheckingAuth: boolean = false; // Prevent UI flashing
  DD_BusinessMasterId: DD_BusinessMasterId[] = [];
branchList:any[]=[];
  constructor(
    private route: Router,
    private dataService: HttpClientConnectionService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    //this.checkAuthentication();
    this.commonService.getDropDownData(12).subscribe((data:any)=>{
      this.DD_BusinessMasterId = data;
     });
  }

  // Check if user is already authenticated
  checkAuthentication(): void {
    debugger
    this.dataService.GetData('Branch/GetBranchListByMaster?businessMasterId='+this.loginFormData.businessMasterId).subscribe((data:any)=>{
      this.branchList=data.data;
    })
    // this.loginFormData.userName = this.commonService.getCookie('userName');
    // this.loginFormData.password = this.commonService.getCookie('password');

    // if (this.loginFormData.userName && this.loginFormData.password) {
    //   const userId = this.commonService.getCookie('userId');
    //   localStorage.setItem('userId', userId);

    //   this.route.navigate(['/analytics']).then(() => {
    //     this.isCheckingAuth = false; // Prevent UI flashing
    //   });
    // } else {
    //   this.isCheckingAuth = false;
    // }
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
          // if (this.loginFormData.rememberMe) {
          //   this.commonService.setCookie('userName', this.loginFormData.userName, 30);
          //   this.commonService.setCookie('password', this.loginFormData.password, 30);
          //   this.commonService.setCookie('userId', data.id, 30);
          //   this.commonService.setCookie('businessMasterId', data.businessMasterId, 30);
          // }else{
          //   this.commonService.deleteAllCookies();
          // }
          // ;
          localStorage.setItem('token',data.tokenString);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('businessMasterId', data.businessMasterId);
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
