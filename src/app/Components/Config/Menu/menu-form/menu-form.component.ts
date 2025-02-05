import { Component, OnInit } from '@angular/core';
import { IMSMenu } from 'src/app/Models/IMSMenu';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { ToastrService } from 'ngx-toastr';
import { DD_Menu } from 'src/app/Models/drodown.model';
import { CommonService } from 'src/app/Services/common.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { take } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { camelCase, mapKeys } from 'lodash';

@Component({
  selector: 'app-menu-form', 
  templateUrl: './menu-form.component.html',
  styleUrl: './menu-form.component.scss'
})

export class MenuFormComponent implements OnInit{
  FormData: IMSMenu = new IMSMenu();
  submitButtonValue:string='Save';
  DD_Menu: DD_Menu[] = [];
  menuTypeList:any[]=[];
  isSubmitting: boolean = false;

constructor(
    private toastr:ToastrService,
    private commonService: CommonService,
    private dataService: HttpClientConnectionService,
    public gridHandleService:GridHandlerService,
     private route:ActivatedRoute,
    private router:Router
  ) { 
    this.route.queryParams.subscribe((data:any)=>{
          if(data.menu !=undefined && data !=null){
           this.getDataById(data.menu);
            
          }else{
            this.FormData =new IMSMenu();
            //this.getLrpNo();
          }
        });
    this.gridHandleService.addNewData$.pipe(take(1)).subscribe(async (data: NgForm) => {
          if (!this.isSubmitting) {
            this.isSubmitting = true;
            try {
              await this.onSubmit(); 
              this.gridHandleService.selectedTab = "List";
              
            } catch (error) {
              console.error('Error during submission:', error);
            } finally {
              this.isSubmitting = false; // Reset flag when the operation completes or fails
            }
          }
        });
  }

  ngOnInit(): void {
    this.commonService.getDropDownData(5).subscribe((data:any)=>{
      this.menuTypeList = data;
     });
     this.getData();
  }
 getDataById(id:any){
    this.dataService.GetData('Menu/GetMenuById?id='+id).subscribe((data:any)=>{
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as IMSMenu;
    })
  }
  onSubmit() {
    if (this.FormData.id === 0) this.insertRecord();
    else this.updateRecord();
  }
  getData = () => {
    this.dataService.GetData("Menu/GetAllMenuList").subscribe((data:any)=>{
      this.DD_Menu=data.data;
    },
    (error:any)=>{
      this.toastr.error("failed to Get Data")
    }
    )
  }

  insertRecord() {
    this.dataService.PostData("Menu/CreateOrUpdateMenu", this.FormData).subscribe(
      res => {
        this.resetForm();
        this.router.navigate(['/menuList']);
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
    this.dataService.PostData("Menu/CreateOrUpdateMenu", this.FormData).subscribe(
      res => {
        this.toastr.info('Updated Successfully', 'Department Information');
        this.router.navigate(['/menuList']);
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
    this.FormData = new IMSMenu();
  }


  ShowHideEvent() {
    console.log("ShowHideEvent");
  }

}
