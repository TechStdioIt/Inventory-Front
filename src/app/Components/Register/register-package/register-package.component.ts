import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  selectedPackageId :number =0;
  isLoading:boolean =false;
  masterId:any =[];
  constructor(private dataService:HttpClientConnectionService,private router:Router,private route: ActivatedRoute){

    this.route.paramMap.subscribe(params => {
      this.masterId = params.get('id');
    });
  }
  ngOnInit(): void {
    this.getPackageData()
  }
  getPackageData(){

    this.dataService.GetData('BusinessMaster/GetPackageData').subscribe((data:any)=>{
      this.packageData = data.data;
    },
    (error:HttpErrorResponse)=>{
      
      console.log(error.message);
    }
  )
  }
  onSubmit(){
    ;
    this.isLoading =true;
    var formData = new FormData();
    formData.append('packegeMasterId',this.selectedPackageId.toString());
    formData.append('id',this.masterId.toString())
    setTimeout(() => {
      ;
      this.dataService.PostData('BusinessMaster/CreateOrUpdateBusinessMaster',formData).subscribe((data:any)=>{
        this.router.navigate(['/auth/register-complete',this.masterId]);
        this.isLoading =false;
      },
      (error:HttpErrorResponse)=>{
        this.isLoading =false;
      }
    )
    }, 2000);
   
  }
  onChangeValue(selectedPackage: any) {
    // Ensure only one package is selected at a time
    this.packageData.forEach(packageItem => {
      packageItem.isSelected = false;
    });
  this.selectedPackageId = selectedPackage.id;
    var exist = this.packageData.find(x=>x.id == selectedPackage.id);
    if(exist){
      exist.selected= true;
    }
  }
}
