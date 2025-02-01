import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mapKeys, camelCase } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AspnetUsers } from 'src/app/Models/AspnetUsers';
import { IMSMenu } from 'src/app/Models/IMSMenu';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit{
  fileData: string | ArrayBuffer | null = null; 
  fileName: string = ''; // Stores the name of the uploaded file
 FormData: AspnetUsers = new AspnetUsers();
  submitButtonValue:string='Save';
  RoleList:any[]=[];
  isSubmitting: boolean = false;
  isDragging: boolean = false; // Toggles drag-and-drop styles
  selectedLogo?:File
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
            this.FormData =new AspnetUsers();
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
     this.getData();
  }
 getDataById(id:any){
    this.dataService.GetData('Administrator/GetUserById?id='+id).subscribe((data:any)=>{
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as AspnetUsers;
    })
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
    datass.append('userName',this.FormData.userName);
    if (this.selectedLogo) {
      datass.append('ProfileImage', this.selectedLogo);
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

  triggerFileInput(): void {
    const fileInput = document.querySelector<HTMLInputElement>('.file-upload-input');
    fileInput?.click();
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
    this.FormData = new AspnetUsers();
  }


  ShowHideEvent() {
    console.log("ShowHideEvent");
  }

}
