import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BusinessTypeDetail, BusinessVM } from 'src/app/Models/Category';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-register-landing',
  templateUrl: './register-landing.component.html',
  styleUrl: './register-landing.component.scss'
})
export class RegisterLandingComponent implements OnInit{
  FormData :BusinessVM = new BusinessVM();
  isLoading :boolean=false;
  buisnessList = [];
  selectedItems:number[] = [];
  dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };
  constructor(private dataService:HttpClientConnectionService,private router:Router){}
  ngOnInit(): void {
   this.getBuisnessType();
  }
  getBuisnessType(){
    this.dataService.GetData("Administrator/GetDropdownData?flag=4").subscribe((data:any)=>{
      this.buisnessList = data
      this.dropdownSettings.itemsShowLimit = this.buisnessList.length;
    })
  }
  onItemSelect(item: any) {
    this.selectedItems.push(item.id);
    var businessDetails = new BusinessTypeDetail();
    businessDetails.businessTypeId = item.id;
    this.FormData.businessTypeDetails.push(businessDetails);
  }

  // Triggered when an item is unselected
  onItemDeSelect(item: any) {
    var exist = this.selectedItems.find(x=>x==item.id );
    var founded = this.FormData.businessTypeDetails.find(x=>x.businessTypeId == item.id);
    if(founded){
      const arrayIndex = this.FormData.businessTypeDetails.indexOf(founded);
      if (arrayIndex !== -1) {
        this.FormData.businessTypeDetails.splice(arrayIndex, 1);
      }
    }
   
    if(exist){
      const index = this.selectedItems.indexOf(exist);
     

    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    }
    }
  }

  // Triggered when all items are selected 
  onSelectAll(items: any) {
    this.buisnessList.forEach((item:any)=>{
      this.selectedItems.push(item.id);
      var businessDetails = new BusinessTypeDetail();
      businessDetails.businessTypeId = item.id;
      this.FormData.businessTypeDetails.push(businessDetails);
    })
  }

  // Triggered when all items are unselected
  onDeSelectAll(items: any) {
    this.selectedItems =[];
    this.FormData.businessTypeDetails = [];
  }
  onSubmit(){
    this.isLoading =true;
    setTimeout(() => {
      var data =new FormData();
      data.append('businessName',this.FormData.businessName);
      data.append('id','0');
      data.append('ownerName',this.FormData.ownerName);
      data.append('email',this.FormData.email);
      data.append('totalBranch',this.FormData.totalBranch.toString());
      data.append('businessName',this.FormData.businessName);
      if (this.FormData.businessTypeDetails.length >0) {
        this.FormData.businessTypeDetails.forEach((detail, index) => {
          data.append(`businessTypeDetails[${index}].businessTypeId`, detail.businessTypeId.toString());
        });
      }
      this.dataService.PostData('BusinessMaster/CreateOrUpdateBusinessMaster',data).subscribe((data:any)=>{
        debugger;
        this.router.navigate(['/auth/register-package',data.data.BusinessId]);
        this.isLoading = false;
      },
      (error:HttpErrorResponse)=>{
        this.isLoading = false;
      }
    )
    }, 2000);

 

    // this.router.navigate(['/auth/register-package'])
  }
}
