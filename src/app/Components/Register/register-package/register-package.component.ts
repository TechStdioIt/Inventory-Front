import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-register-package',
  standalone: true,
  imports: [SharedModule, RouterModule,NgMultiSelectDropDownModule],
  templateUrl: './register-package.component.html',
  styleUrl: './register-package.component.scss'
})
export class RegisterPackageComponent implements OnInit{
  packageData:any[]=[];
  constructor(private dataService:HttpClientConnectionService,private router:Router){}
  ngOnInit(): void {
    this.getPackageData()
  }
  getPackageData(){

    this.dataService.GetData('BusinessMaster/GetPackageData').subscribe((data:any)=>{
debugger;
      this.packageData = data.data;
    },
    (error:HttpErrorResponse)=>{
      
      console.log(error.message);
    }
  )
  }
  onSubmit(){
    this.router.navigate(['/auth/register-'])
  }
}
