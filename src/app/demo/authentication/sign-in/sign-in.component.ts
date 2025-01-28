// angular import
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from 'src/app/Models/Category';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export default class SignInComponent implements OnInit{
  showPassword = false;
  isLoading :boolean=false;
  loginFormData:Login= new Login();
  constructor(private route:Router,private dataService:HttpClientConnectionService){

  }
  ngOnInit(): void {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;  // Toggle the value
  }
  OnSubmit(){
    this.isLoading =true;
    setTimeout(() => {
      if(this.loginFormData.userName != '' || this.loginFormData.password != ''){
        this.dataService.PostData('Administrator/Login',this.loginFormData).subscribe((data:any)=>{
          if(this.loginFormData.rememberMe){
            localStorage.setItem('userName',this.loginFormData.userName);
            localStorage.setItem('userPass',this.loginFormData.password);
          }
          localStorage.setItem('userId',data.userId);
          this.route.navigate(['/analytics']);
          this.isLoading = false;
        },
      (error:HttpErrorResponse)=>{
        this.isLoading  = false;
        console.log(error.message);
      }
      )
      this.route.navigate(['/analytics']);
      } 
    }, 2000);
    
   
  }
}
