import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { mapKeys, camelCase } from 'lodash';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { AspNetRole, AspnetUsers, UserBranch } from 'src/app/Models/AspnetUsers';
import { IMSMenu } from 'src/app/Models/IMSMenu';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit,OnDestroy{
  @ViewChild('fileInput') fileInput!: ElementRef;

  fileData: string | ArrayBuffer | null = null; 
  fileName: string = ''; // Stores the name of the uploaded file
 FormData: AspnetUsers = new AspnetUsers();
  submitButtonValue:string='Save';
  selectedTree: AspNetRole[] = [];
  RoleList:any[]=[];
  isSubmitting: boolean = false;
  isDragging: boolean = false; // Toggles drag-and-drop styles
  selectedLogo?:File;
   selectedBranch : any[]=[];

  private destroy$ = new Subject<void>();
 dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'branchName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 15,
    allowSearchFilter: true
  };
   branchList:any[] = [];
  emailValidators = [Validators.required, this.emailFormatValidator];
constructor(
    private toastr:ToastrService,
    private commonService: CommonService,
    private dataService: HttpClientConnectionService,
    public gridHandleService:GridHandlerService,
     private route:ActivatedRoute,
    private router:Router
  ) { 
    this.route.queryParams.subscribe((data:any)=>{
          if(data.do !=undefined && data !=null){
           this.getDataById(data.do);
            
          }else{
            this.FormData =new AspnetUsers();
            //this.getLrpNo();
          }
        });
 

        this.gridHandleService.add$
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribes when component is destroyed
      .subscribe(async (data: NgForm) => {
        if (!this.isSubmitting) {
          // Prevent multiple submissions
          this.isSubmitting = true;

          try {
            await this.onSubmit(); // Your form submission logic
            this.gridHandleService.selectedTab = 'List';
          } catch (error) {
            console.error('Error during submission:', error);
          } finally {
            this.isSubmitting = false; // Reset flag after completion
          }
        }
      });




  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
     this.getData();
     this.getBranchData();
  }
 getDataById(id:any){
    this.dataService.GetData('Administrator/GetUserById?id='+id).subscribe((data:any)=>{
      // this.FormData=data.data;
       this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as AspnetUsers;
      this.fileData= data.data.profileImageUrl;
          if(data.data.roles.length >0){
        this.selectedTree = data.data.roles.map((x:any)=>x.roleId);
      }
      
    })
  }
  
  getBranchData = ()=>{
   this.dataService.GetData("Branch/GetBranchList").subscribe((data:any)=>{
     ;
      this.branchList=data.data;
    },
    (error:any)=>{
      this.toastr.error("failed to Get Data")
    }
    )
  }
  onSubmit() {
   this.insertRecord();
    
  }
  getData = () => {
    this.dataService.GetData("Administrator/ListRoles").subscribe((data:any)=>{
      this.RoleList=data;
    },
    (error:any)=>{
      this.toastr.error("failed to Get Data")
    }
    )
  }
  removeFile(): void {
    this.fileData = null;
    this.fileName = '';
    this.selectedLogo= undefined;
  }
    // Handle file selection
    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        this.fileName = file.name;
        this.selectedLogo = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.fileData = e.target.result; // Store base64 image data
          }
        };
        reader.readAsDataURL(file);
      }
    }
  insertRecord() {
    var datass = new FormData();
    datass.append('email',this.FormData.email);
    datass.append('userFName',this.FormData.userFName);
    datass.append('mobile',this.FormData.mobile);
    datass.append('userName',this.FormData.email);
    datass.append('id',this.FormData.id);
    if (this.selectedLogo) {
      datass.append('ProfileImage', this.selectedLogo);
    }
    if(this.selectedTree.length >0){
      datass.append('userRoleId',this.selectedTree.map(item => item.id).join(","));
    }
    if(this.selectedBranch.length > 0){
      datass.append('branchList',this.FormData.branchList.map(x=>x.branchId).join());
    }

    this.dataService.PostData("Administrator/SaveUser", datass).subscribe(
      res => {
        this.resetForm();
        this.router.navigate(['/userList']);
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

  emailFormatValidator(control: FormControl) {
    const email = control.value;
    if (email && !email.includes('@')) {
      return { invalidEmail: true };
    }
    return null;
  }
  
  // Handle drag over
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  // Handle drag leave
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  // Handle drop
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.fileName = file.name;
      this.selectedLogo = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.fileData = e.target.result; // Store base64 image data
        }
      };
      reader.readAsDataURL(file);
    }
  }


 
  resetForm() {
    this.FormData = new AspnetUsers();
  }


  ShowHideEvent() {
    console.log("ShowHideEvent");
  }


  treeViewSelectionChanged(e: any) {
    this.syncSelection(e.component);
  }
  syncSelection(treeView: any) {
    this.selectedTree = treeView.getSelectedNodes()
      .map((node: any) => node.itemData);
  }
    treeViewContentReadyRole(e: DxTreeViewTypes.ContentReadyEvent) {
    setTimeout(() => {
      if(this.selectedTree.length >0){
        this.selectedTree.forEach(element => {
          e.component.selectItem(element.id);
        });
       }
    }, 1000); // Give a small delay before attempting to select items
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

// Triggered when an item is unselected
  onItemDeSelect(item: any) {
    var exist = this.selectedBranch.find(x=>x==item.id );
    var founded = this.FormData.branchList.find(x=>x.branchId == item.id);
    if(founded){
      const arrayIndex = this.FormData.branchList.indexOf(founded);
      if (arrayIndex !== -1) {
        this.FormData.branchList.splice(arrayIndex, 1);
      }
    }
   
    if(exist){
      const index = this.selectedBranch.indexOf(exist);
     


    if (index !== -1) {
      this.selectedBranch.splice(index, 1);
    }
    }
  }

  // Triggered when all items are selected 
  onSelectAll(items: any) {
    this.branchList.forEach((item:any)=>{
      this.selectedBranch.push(item.id);
      var businessDetails = new UserBranch();
      businessDetails.branchId = item.id;
      this.FormData.branchList.push(businessDetails);
    })
  }

  // Triggered when all items are unselected
  onDeSelectAll(items: any) {
    this.selectedBranch =[];
    this.FormData.branchList = [];
  }
  onItemSelect(item: any) {
     ;
    this.selectedBranch.push(item.id);
    var businessDetails = new UserBranch();
    businessDetails.branchId = item.id;
    this.FormData.branchList.push(businessDetails);
  }

}
