import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-menu-permission-form',
  templateUrl: './menu-permission-form.component.html',
  styleUrl: './menu-permission-form.component.scss'
})
export class MenuPermissionFormComponent implements OnInit{
  RMMS_Role_Permission:any[]=[];
  BP_RoleList:any[]=[];
  selectedRoll:any;
  isLoadPanelVisible:boolean=false;

  isViewHeaderChecked: boolean = false;

  constructor(
    private dataService:HttpClientConnectionService,
    private toastr:ToastrService,
    private cd:ChangeDetectorRef
    ) { 
    
  }

  ngOnInit(){
    
    this.getBPRole();
  }
  getBPRole(){
    this.dataService.GetData("Administrator/ListRoles").subscribe((data:any)=>{
        this.BP_RoleList=data;
    },
    (error:any)=>{
      console.log(error);
      this.toastr.error("failed to Get Data")
    }
    )
  }
  ChangedRoll(evt:any){
    this.isLoadPanelVisible=true;
   this.selectedRoll=evt.value;
    this.dataService.GetData(`ManageMenuPermission/GetPermissionByRollId?RoleId=${this.selectedRoll}`).subscribe((data:any)=>{
        this.RMMS_Role_Permission=data.data;
        this.isLoadPanelVisible=false;
    })
  }

  onCheckboxChange(event: any,propertyName:string) {
    const isChecked = event.target.checked;
    this.RMMS_Role_Permission.forEach(item => {
      item[propertyName]=isChecked; 
      item.roleId=this.selectedRoll;
    });
    this.cd.markForCheck();

    // Alternatively, force Angular to detect changes with setTimeout
    setTimeout(() => {
      this.cd.detectChanges();
    }, 0);
  }
  isCheck(evt:any,propertyName:string){
    
    return evt.data[propertyName];
  }
  onSingleChange(evt:any,propertyName:string){
    var exist= this.RMMS_Role_Permission.find(x=>x.menuId==evt.data.menuId);
    if(exist){
      exist[propertyName]=!exist[propertyName];
      exist.roleId=this.selectedRoll;
    
}
  }
  OnSubmit(){
    console.log(this.RMMS_Role_Permission);
    this.dataService.PostData("ManageMenuPermission/UpdatePermission",this.RMMS_Role_Permission).subscribe((data:any)=>{
      if(data){
        this.toastr.success("Updated  Successfully","Successfully !");
        //setTimeout use Because when update a permission then we need get updated permissionwise menu and Submenu.
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }),
    (error:any)=>{
      this.toastr.error("Failed to Update data","Failure !");
      console.log(error);
    }
  }
  isCheckHeader(propertyName:string){
    
    if(this.RMMS_Role_Permission.length>0){
      var checked=this.RMMS_Role_Permission.filter(x=>x[propertyName] ==true);
      if(checked.length ==this.RMMS_Role_Permission.length){
        return true;
      }
    }

    return false;
  }
  abc(){
    console.log("abc");
  }


}
