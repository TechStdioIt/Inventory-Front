import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-register-landing',
  standalone: true,
  imports: [SharedModule, RouterModule,NgMultiSelectDropDownModule],
  templateUrl: './register-landing.component.html',
  styleUrl: './register-landing.component.scss'
})
export class RegisterLandingComponent implements OnInit{
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
  }

  // Triggered when an item is unselected
  onItemDeSelect(item: any) {
    var exist = this.selectedItems.find(x=>x==item.id )
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
    })
  }

  // Triggered when all items are unselected
  onDeSelectAll(items: any) {
    this.selectedItems =[];
  }
  onSubmit(){
    this.router.navigate(['/auth/register-package'])
  }
}
