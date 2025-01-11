import { Component } from '@angular/core';
import { IMSMenu } from 'src/app/Models/IMSMenu';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { ToastrService } from 'ngx-toastr';
import { DD_Menu } from 'src/app/Models/drodown.model';
import { CommonService } from 'src/app/Services/common.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-menu-form', 
  templateUrl: './menu-form.component.html',
  styleUrl: './menu-form.component.scss'
})

export class MenuFormComponent {

  submitButtonValue:string='Save';
  DD_Menu: DD_Menu[] = [];

constructor(
    public menuListComponent:MenuListComponent,
    private toastr:ToastrService,
    private commonService: CommonService,
    private dataService: HttpClientConnectionService
  ) { }

  ngOnInit(): void {
    this.commonService.getDropDownData(3,"DD_Gender");
  }

  onSubmit() {
    debugger
    if (localStorage.getItem('_userId') != null) {
      this.menuListComponent.FormData.createdBy = localStorage.getItem('_userId');
    }
    debugger
    if (this.menuListComponent.FormData.id === 0) this.insertRecord();
    else this.updateRecord();
  }

  insertRecord() {
    this.dataService.PostData("Menu/CreateOrUpdateMenu", this.menuListComponent.FormData).subscribe(
      res => {
        this.resetForm();
        this.menuListComponent.getData();
        this.toastr.success('Created Successfully', 'User Information');
        this.commonService.iSButtonManagementComponentFormShow = !this.commonService.iSButtonManagementComponentFormShow;
        console.log(res);
      },
      err => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');
        console.log(err);
      }
    );
    
  }



  updateRecord() { 
    this.dataService.PutData("Menu/CreateOrUpdateMenu", this.menuListComponent.FormData.id, this.menuListComponent.FormData).subscribe(
      res => {
        this.menuListComponent.getData();
        this.toastr.info('Updated Successfully', 'Department Information');
        this.commonService.iSButtonManagementComponentFormShow = !this.commonService.iSButtonManagementComponentFormShow;
        console.log(res);
      },
      err => {
        this.toastr.error('Please Try Again', 'Invalid Information!!')
        console.log(err);
      }
    );
  }
  resetForm() {
    this.menuListComponent.FormData = new IMSMenu();
  }


  ShowHideEvent() {
    console.log("ShowHideEvent");
  }

}
