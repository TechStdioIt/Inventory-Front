import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BusinessVM } from 'src/app/Models/Category';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-register-complete',
  standalone: true,
  imports: [SharedModule, RouterModule,NgMultiSelectDropDownModule],
  templateUrl: './register-complete.component.html',
  styleUrl: './register-complete.component.scss'
})
export class RegisterCompleteComponent implements OnInit{
  masterId: any = 0;
  isLoading:boolean=false;
  fileData: string | ArrayBuffer | null = null; // Stores the base64 image data
  fileName: string = ''; // Stores the name of the uploaded file
  isDragging: boolean = false; // Toggles drag-and-drop styles
  FormData: BusinessVM = new BusinessVM();
selectedLogo?:File
  constructor(
    private route: ActivatedRoute,
    private dataService: HttpClientConnectionService,
    private router:Router
  ) {
    this.route.paramMap.subscribe((params) => {
      this.masterId = params.get('id');
      console.log(this.masterId);
    });
  }

  ngOnInit(): void {}

  // Trigger file input click
  triggerFileInput(): void {
    const fileInput = document.querySelector<HTMLInputElement>('.file-upload-input');
    fileInput?.click();
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

  // Remove the uploaded file
  removeFile(): void {
    this.fileData = null;
    this.fileName = '';
    this.selectedLogo= undefined;
  }
  onSubmit(){
     this.isLoading =true;
        var formData = new FormData();
        if (this.selectedLogo) {
          formData.append('logoFile',this.selectedLogo);
        }
       formData.append('address',this.FormData.address);
       formData.append('contactNumber',this.FormData.contactNumber);
      formData.append('id',this.masterId.toString())
        setTimeout(() => {
          this.dataService.PostData('BusinessMaster/CreateOrUpdateBusinessMaster',formData).subscribe((data:any)=>{
            this.getUserRedirectInfo();
            this.getBusinessMasterData();
            this.isLoading =false;
          },
          (error:HttpErrorResponse)=>{
            this.isLoading =false;
          }
        )
        }, 2000);
  }
  getUserRedirectInfo(){
    this.dataService.GetData(`Administrator/CheckSpecialUserByBusinessId?businessMasterId=${Number(this.masterId)}`).subscribe((data:any)=>{
  
      if(data.data.UserType == 'NormalUser'){
        this.router.navigate(['/auth/signin']);
      }else{
        this.router.navigate(['/auth/register-verify']);
      }
    },
    (error:HttpErrorResponse)=>{
      console.log(error.message);
    }
  )
  }
  getBusinessMasterData(){
    this.dataService.GetData(`BusinessMaster/GetByIdBusinessMaster?id=${this.masterId}`).subscribe((data:any)=>{
      const saveUserData = {
        email : data.data.email,
        userFName :data.data.ownerName,
        userTypeId :1,
        mobile : data.data.contactNumber,
        userName :data.data.email


      }
      this.SaveUser(saveUserData);
    })
  }
  SaveUser(userData:any){
    var datass = new FormData();
    datass.append('email',userData.email);
    datass.append('userFName',userData.userFName);
    datass.append('userTypeId',userData.userTypeId);
    datass.append('mobile',userData.mobile);
    datass.append('userName',userData.userName);
    this.dataService.PostData('Administrator/SaveUser',datass).subscribe((data:any)=>{
      
    })
  }

}
