import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxNumberBoxModule, DxPopupModule, DxSelectBoxModule, DxTextBoxComponent, DxTextBoxModule } from 'devextreme-angular';
import { Login } from 'src/app/Models/Category';
import { DD_BusinessMasterId } from 'src/app/Models/drodown.model';
import { CommonService } from 'src/app/Services/common.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule, DxSelectBoxModule, DxPopupModule, DxTextBoxModule,DxNumberBoxModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export default class SignInComponent implements OnInit {
  showPassword = false;
  isPopupVisible = false;
  popupWidth: string = '0%';

  isShowLoginError: boolean = false;
  loginError: string = '';
  isLoading: boolean = false;
  loginFormData: Login = new Login();
  isCheckingAuth: boolean = false; // Prevent UI flashing
  DD_BusinessMasterId: DD_BusinessMasterId[] = [];
  isPopupVisibleResetPass: boolean = false;
  branchList: any[] = [];
  showOTPInputBox: boolean = false;
// 6 zeros
otp: number[] = Array(6);
// Array to hold OTP digits

     @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  timerCount: number = 0;
  timerInterval: any;
  constructor(
    private route: Router,
    private dataService: HttpClientConnectionService
  ) {
    this.setPopupWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setPopupWidth();
  }

  setPopupWidth() {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      this.popupWidth = '80%'; // Mobile screen
    } else {
      this.popupWidth = '25%'; // Larger screens (you can adjust this percentage)
    }
  }

  ngOnInit(): void {
    //this.checkAuthentication();

  }

onOtpInput(event: any, index: number) {
  debugger;
    var value = event.event.originalEvent.data;

    // Keep only 1 character
    this.otp[index] = value.slice(0, 1);
    value = this.otp[index];

    // Move focus to next input
    if (value && index < this.otp.length - 1) {
      var otpInputList = document.getElementById('otpContainer');
      if (otpInputList) {
     const inputs = otpInputList.querySelectorAll('input:not([type="hidden"])');
    var nextInput = inputs[index + 1] as HTMLInputElement;
        if (nextInput) {
          nextInput.value = '';
          nextInput.onmouseenter = () => {
          //  nextInput.mou
          }
           
        }
      }
            // const nextInput = this.otpInputs.get(index + 1)
      // nextInput?.nativeElement?.focusStateEnabled(); // Focus the next input if it exists
      // //nextInput.nativeElement.value = ''; // Clear the next input
    }
  }

  // Check if user is already authenticated
  checkAuthentication(): void {
    if (this.loginFormData.businessMasterId > 0) {
      this.dataService.GetData('Branch/GetBranchListByMasterAndUser?businessMasterId=' + this.loginFormData.businessMasterId).subscribe((data: any) => {
        this.branchList = data.data;
      })
    }


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

  NextFromLogin() {
    this.dataService.PostData('Administrator/Login', this.loginFormData).subscribe(
      (data: any) => {
        this.DD_BusinessMasterId = data.businessList;
        localStorage.setItem('token', data.tokenString);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('businessMasterId', data.businessMasterId);
        this.isPopupVisible = true;
      },
      (error: HttpErrorResponse) => {
         this.isPopupVisible = false;
        this.showError(error.error.message || 'Login failed');
      })


    
  }


  ResetBtn(){
    this.isPopupVisibleResetPass = true;
  }
   SendOtpbtn() {
    this.showOTPInputBox = true;
    this.startTimer();
    // Logic to send OTP
  }

   resendOTP() {
    this.startTimer();
    // Logic to resend OTP
  }
 backBtn() {
    this.showOTPInputBox = false;
  }
  submitOTPBtn(){
    // Logic to submit OTP
    // You can add your logic here to verify the OTP entered by the user
    // For example, you might want to call an API to verify the OTP
    this.isPopupVisibleResetPass = false;
    this.showOTPInputBox = false;
    this.startTimer();
  }
  startTimer() {
    this.timerCount = 10;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.timerCount--;
      if (this.timerCount <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }


  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  OnFinalSubmit() {
    this.OnSubmit()
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
          localStorage.setItem('token', data.tokenString);
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
